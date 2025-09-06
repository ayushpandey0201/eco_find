# This Terraform configuration creates a MySQL RDS instance.
# It uses data sources to find the default VPC and the specified
# security group by name.

# Configure the AWS provider
provider "aws" {
  region = "us-east-1"  # You can change this to your desired region
}

# Use a data source to find the default VPC
data "aws_vpc" "default" {
  default = true
}

# Use a data source to find the security group by name
data "aws_security_group" "jenkins" {
  name = "jenkins-SG"
}

# Create the RDS database instance
resource "aws_db_instance" "ecofinds_mysql" {
  # Database engine and version
  engine         = "mysql"
  engine_version = "8.0.32" # A common, stable community version of MySQL

  # Free tier configuration
  instance_class      = "db.t3.micro"  # Part of the AWS free tier
  allocated_storage   = 20               # 20 GB of storage for free tier
  multi_az            = false          # Do not use multi-AZ for free tier

  # User-specified details
  db_name             = "ecofinds"
  username            = "root"
  password            = "ecofindsaws"
  publicly_accessible = true

  # Networking and security
  vpc_security_group_ids = [data.aws_security_group.jenkins.id]
  db_subnet_group_name   = "default" # Use default subnet group in the VPC

  # Deletion and lifecycle settings for easy testing and cleanup
  skip_final_snapshot  = true
  deletion_protection  = false
}

# A simple output to display the endpoint of the new database
output "rds_endpoint" {
  value = aws_db_instance.ecofinds_mysql.address
}
