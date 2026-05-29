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

variable "db_subnet_id" {
  type = string
}

variable "db_admin_password" {
  type      = string
  sensitive = true
}

variable "sku_name" {
  type    = string
  default = "B_Standard_B1ms"
}

variable "storage_mb" {
  type    = number
  default = 32768
}
