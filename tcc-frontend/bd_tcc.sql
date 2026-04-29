CREATE DATABASE  IF NOT EXISTS `acervo_tcc` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `acervo_tcc`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: acervo_tcc
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alunos`
--

DROP TABLE IF EXISTS `alunos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alunos` (
  `idAluno` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`idAluno`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cursos`
--

DROP TABLE IF EXISTS `cursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cursos` (
  `idCurso` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `areaFormacao` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idCurso`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `historicomovimentacao`
--

DROP TABLE IF EXISTS `historicomovimentacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historicomovimentacao` (
  `idMov` int(11) NOT NULL AUTO_INCREMENT,
  `idTcc` int(11) DEFAULT NULL,
  `idUtilizador` int(11) NOT NULL,
  `dataAcao` timestamp NOT NULL DEFAULT current_timestamp(),
  `tipoAcao` varchar(50) NOT NULL,
  `tituloTcc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idMov`),
  KEY `fk_HistTcc` (`idTcc`),
  KEY `fk_HistTser` (`idUtilizador`),
  CONSTRAINT `fk_HistTcc` FOREIGN KEY (`idTcc`) REFERENCES `tccs` (`idTcc`) ON DELETE SET NULL,
  CONSTRAINT `fk_HistTser` FOREIGN KEY (`idUtilizador`) REFERENCES `utilizadores` (`idUtilizador`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `locaisarmazenamento`
--

DROP TABLE IF EXISTS `locaisarmazenamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locaisarmazenamento` (
  `idLocal` int(11) NOT NULL AUTO_INCREMENT,
  `blocoArquivo` varchar(50) NOT NULL,
  `estante` varchar(20) NOT NULL,
  `prateleira` varchar(20) NOT NULL,
  `compartimento` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idLocal`)
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `logsacesso`
--

DROP TABLE IF EXISTS `logsacesso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logsacesso` (
  `idLog` int(11) NOT NULL AUTO_INCREMENT,
  `idUtilizador` int(11) NOT NULL,
  `tipoEvento` varchar(50) NOT NULL,
  `descricaoEvento` text DEFAULT NULL,
  `dataEvento` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`idLog`),
  KEY `idUtilizador` (`idUtilizador`),
  CONSTRAINT `logsacesso_ibfk_1` FOREIGN KEY (`idUtilizador`) REFERENCES `utilizadores` (`idUtilizador`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tcc_autores`
--

DROP TABLE IF EXISTS `tcc_autores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tcc_autores` (
  `idTcc` int(11) NOT NULL,
  `idAluno` int(11) NOT NULL,
  PRIMARY KEY (`idTcc`,`idAluno`),
  KEY `fk_vinculo_aluno` (`idAluno`),
  CONSTRAINT `fk_vinculo_aluno` FOREIGN KEY (`idAluno`) REFERENCES `alunos` (`idAluno`) ON DELETE CASCADE,
  CONSTRAINT `fk_vinculo_tcc` FOREIGN KEY (`idTcc`) REFERENCES `tccs` (`idTcc`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tccs`
--

DROP TABLE IF EXISTS `tccs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tccs` (
  `idTcc` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `tipo_projeto` varchar(50) DEFAULT NULL,
  `orientadorNome` varchar(100) DEFAULT NULL,
  `anoDefesa` int(11) NOT NULL,
  `statusAprovacao` enum('Aprovado','Reprovado') DEFAULT 'Aprovado',
  `notaFinal` int(2) DEFAULT NULL,
  `idCurso` int(11) NOT NULL,
  `idLocal` int(11) NOT NULL,
  `dataHora` datetime DEFAULT NULL,
  PRIMARY KEY (`idTcc`),
  KEY `fk_TccCurso` (`idCurso`),
  KEY `fk_TccLocal` (`idLocal`),
  CONSTRAINT `fk_TccCurso` FOREIGN KEY (`idCurso`) REFERENCES `cursos` (`idCurso`) ON DELETE CASCADE,
  CONSTRAINT `fk_TccLocal` FOREIGN KEY (`idLocal`) REFERENCES `locaisarmazenamento` (`idLocal`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `utilizadores`
--

DROP TABLE IF EXISTS `utilizadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilizadores` (
  `idUtilizador` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `numProcesso` varchar(20) DEFAULT NULL,
  `dataCriacao` timestamp NOT NULL DEFAULT current_timestamp(),
  `tentativasFalhas` int(11) DEFAULT 0,
  PRIMARY KEY (`idUtilizador`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `numProcesso` (`numProcesso`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-29 20:33:25
