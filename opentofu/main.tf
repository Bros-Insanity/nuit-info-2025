terraform {
  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = "~> 0.60"
    }
  }
}

provider "proxmox" {
  endpoint = var.proxmox_api_host
  api_token = "${var.proxmox_api_user}=${var.proxmox_api_token_secret}"
  insecure = true
  ssh {
    agent = true
  }
}

variable "proxmox_api_host" {
  type = string
}

variable "proxmox_api_user" {
  type = string
}

variable "proxmox_api_token_secret" {
  type = string
  sensitive = true
}

variable "proxmox_node" {
  type = string
}

variable "github_repo" {
  type = string
}


resource "proxmox_virtual_environment_container" "web" {
  node_name = var.proxmox_node
  vm_id     = 30000

  initialization {
    hostname = "web-nuit-info"
    ip_config {
      ipv4 {
        address = "10.0.0.20/24"
        gateway = "10.0.0.254"
      }
    }
    dns {
      servers = ["1.1.1.1"]
    }
  }

  operating_system {
    template_file_id = "local:vztmpl/debian-12-standard_12.7-1_amd64.tar.zst"
    type             = "debian"
  }

  cpu {
    cores = 1
  }

  memory {
    dedicated = 512
  }

  disk {
    datastore_id = "data"
    size         = 8
  }

  network_interface {
    name    = "eth0"
    bridge  = "vmbr0"
    enabled = true
  }

  start_on_boot = true

  provisioner "local-exec" {
    command = <<-EOT
      sleep 30
      ssh -o StrictHostKeyChecking=no root@${var.proxmox_api_host} "pct exec 30000 -- bash -c 'export DEBIAN_FRONTEND=noninteractive && apt-get update && apt-get install -y nginx curl && curl -o /var/www/html/index.html ${var.github_repo} && systemctl enable --now nginx'"
    EOT
  }
}

