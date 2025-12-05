#!/bin/bash

echo "Ajout de tous les droits au role TerraformProvision..."

pveum role add TerraformProvisionFull --privs \
"Datastore.Allocate \
Datastore.AllocateSpace \
Datastore.AllocateTemplate \
Datastore.Audit \
Group.Allocate \
Mapping.Audit \
Mapping.Modify \
Mapping.Use \
Permissions.Modify \
Pool.Allocate \
Pool.Audit \
Realm.Allocate \
Realm.AllocateUser \
SDN.Allocate \
SDN.Audit \
SDN.Use \
Sys.AccessNetwork \
Sys.Audit \
Sys.Console \
Sys.Incoming \
Sys.Modify \
Sys.PowerMgmt \
Sys.Syslog \
User.Modify \
VM.Allocate \
VM.Audit \
VM.Backup \
VM.Clone \
VM.Config.CDROM \
VM.Config.CPU \
VM.Config.Cloudinit \
VM.Config.Disk \
VM.Config.HWType \
VM.Config.Memory \
VM.Config.Network \
VM.Config.Options \
VM.Console \
VM.GuestAgent.Audit \
VM.GuestAgent.FileRead \
VM.GuestAgent.FileSystemMgmt \
VM.GuestAgent.FileWrite \
VM.GuestAgent.Unrestricted \
VM.Migrate \
VM.PowerMgmt \
VM.Replicate \
VM.Snapshot \
VM.Snapshot.Rollback"

echo "Role TerraformProvisionFull cree avec tous les droits VM."

echo ""
echo "Pour assigner ce role a terraform@pam sur / :"
echo "pveum user modify terraform@pam -group TerraformProvisionFull"
echo ""
echo "OU pour modifier le role existant TerraformProvision :"
echo "pveum role modify TerraformProvision --privs \"[liste des droits ci-dessus]\""

