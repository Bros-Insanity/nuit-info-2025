variable "proxmox_api_host" {
  type        = string
  description = "Proxmox API host"
}

variable "proxmox_api_user" {
  type        = string
  description = "Proxmox API user"
}

variable "proxmox_api_token_secret" {
  type        = string
  description = "Proxmox API token secret"
  sensitive   = true
}

variable "proxmox_node" {
  type        = string
  description = "Proxmox node name"
}

variable "github_repo" {
  type        = string
  description = "GitHub repo URL for test.html"
}

