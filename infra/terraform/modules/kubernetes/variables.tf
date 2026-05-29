variable "environment" {
  type = string
}

variable "project_name" {
  type    = string
  default = "freecrm"
}

variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "app_subnet_id" {
  type = string
}

variable "node_count" {
  type    = number
  default = 2
}

variable "vm_size" {
  type    = string
  default = "Standard_B2s"
}
