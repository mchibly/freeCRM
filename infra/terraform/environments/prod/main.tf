terraform {
  required_version = ">= 1.6"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90"
    }
  }

  backend "azurerm" {
    resource_group_name  = "freecrm-tfstate-rg"
    storage_account_name = "freecrmtfstate"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
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
  name     = "freecrm-prod-rg"
  location = "eastus2"
}

module "networking" {
  source              = "../../modules/networking"
  environment         = "prod"
  project_name        = "freecrm"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

module "database" {
  source              = "../../modules/database"
  environment         = "prod"
  project_name        = "freecrm"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  db_subnet_id        = module.networking.db_subnet_id
  db_admin_password   = var.db_admin_password
  sku_name            = "GP_Standard_D2s_v3"
  storage_mb          = 131072
}

module "kubernetes" {
  source              = "../../modules/kubernetes"
  environment         = "prod"
  project_name        = "freecrm"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  app_subnet_id       = module.networking.app_subnet_id
  node_count          = 3
  vm_size             = "Standard_D4s_v3"
}

output "aks_cluster_name" {
  value = module.kubernetes.cluster_name
}

output "db_fqdn" {
  value = module.database.server_fqdn
}
