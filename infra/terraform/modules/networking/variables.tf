variable "vpc_cidr" {
  type        = string
  default     = "10.0.0.0/16"
  description = "CIDR block for the VPC"
}

variable "environment" {
  type        = string
  description = "Environment name (dev, prod)"
}

variable "project_name" {
  type    = string
  default = "freecrm"
}

variable "location" {
  type = string
}

variable "resource_group_name" {
  type = string
}
