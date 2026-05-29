terraform {
  required_version = ">= 1.6"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90"
    }
  }
}

provider "azurerm" {
  features {}
}

variable "db_admin_password" {
  type      = string
  sensitive = true
}

resource "azurerm_resource_group" "main" {
  name     = "freecrm-dev-rg"
  location = "eastus2"
}

module "networking" {
  source              = "../../modules/networking"
  environment         = "dev"
  project_name        = "freecrm"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

module "database" {
  source              = "../../modules/database"
  environment         = "dev"
  project_name        = "freecrm"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  db_subnet_id        = module.networking.db_subnet_id
  db_admin_password   = var.db_admin_password
  sku_name            = "B_Standard_B1ms"
  storage_mb          = 32768
}

module "kubernetes" {
  source              = "../../modules/kubernetes"
  environment         = "dev"
  project_name        = "freecrm"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  app_subnet_id       = module.networking.app_subnet_id
  node_count          = 1
  vm_size             = "Standard_B2s"
}

output "aks_cluster_name" {
  value = module.kubernetes.cluster_name
}

output "db_fqdn" {
  value = module.database.server_fqdn
}
