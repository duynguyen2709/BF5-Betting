CREATE DATABASE  IF NOT EXISTS `Bf5Betting` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `Bf5Betting`;
-- Server version	8.1.0

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
-- Table structure for table `BetHistory`
--

DROP TABLE IF EXISTS `BetHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BetHistory` (
  `betId` bigint NOT NULL,
  `playerId` varchar(16) NOT NULL,
  `betType` varchar(16) NOT NULL DEFAULT 'SINGLE',
  `metadata` varchar(256) DEFAULT NULL,
  `betAmount` bigint NOT NULL DEFAULT '0',
  `ratio` decimal(7,5) NOT NULL DEFAULT '0.00000',
  `potentialProfit` bigint NOT NULL DEFAULT '0',
  `result` varchar(16) NOT NULL DEFAULT 'NOT_FINISHED',
  `resultSettledTime` timestamp NULL DEFAULT NULL,
  `actualProfit` bigint DEFAULT NULL,
  `betTime` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`betId`),
  KEY `idx_playerId_betTime` (`playerId`,`betTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `BetMatchDetail`
--

DROP TABLE IF EXISTS `BetMatchDetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BetMatchDetail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `betId` bigint NOT NULL,
  `matchId` bigint DEFAULT '0',
  `matchTime` timestamp NOT NULL,
  `firstTeam` varchar(256) NOT NULL,
  `secondTeam` varchar(256) DEFAULT NULL,
  `tournamentName` varchar(256) DEFAULT NULL,
  `event` varchar(64) NOT NULL,
  `firstHalfOnly` tinyint DEFAULT NULL,
  `score` varchar(256) DEFAULT NULL,
  `ratio` decimal(5,3) NOT NULL DEFAULT '0.000',
  `result` varchar(16) NOT NULL DEFAULT 'NOT_FINISHED',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_BetMatchDetail_BetHistory_idx` (`betId`),
  CONSTRAINT `fk_BetMatchDetail_BetHistory` FOREIGN KEY (`betId`) REFERENCES `BetHistory` (`betId`)
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Player`
--

DROP TABLE IF EXISTS `Player`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Player` (
  `playerId` varchar(16) NOT NULL,
  `playerName` varchar(256) DEFAULT NULL,
  `avatarUrl` varchar(2048) DEFAULT NULL,
  `totalProfit` bigint DEFAULT NULL,
  PRIMARY KEY (`playerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Player`
--

LOCK TABLES `Player` WRITE;
/*!40000 ALTER TABLE `Player` DISABLE KEYS */;
INSERT INTO `Player` VALUES ('100002362515754','Duy Nguyễn','/avatar/DuyNguyen.webp',0),('100004056801368','Thanh Duy','/avatar/ThanhDuy.webp',0),('100004533095969','Trung Anh','/avatar/TrungAnh.webp',0),('100010972726703','Tân','/avatar/TanNguyen.webp',0),('100004614064009','Bruno','/avatar/Bruno.webp',0),('100003664809869','Rys','/avatar/Rys.webp',0);
/*!40000 ALTER TABLE `Player` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PlayerAssetHistory`
--

DROP TABLE IF EXISTS `PlayerAssetHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PlayerAssetHistory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `playerId` varchar(16) NOT NULL,
  `betId` bigint DEFAULT NULL,
  `paymentTime` timestamp NOT NULL,
  `action` varchar(64) NOT NULL,
  `paymentMethod` varchar(64) DEFAULT NULL,
  `amount` bigint NOT NULL,
  `assetBefore` bigint NOT NULL,
  `assetAfter` bigint NOT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_playerId_paymentTime` (`playerId`,`paymentTime`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TeamData`
--

DROP TABLE IF EXISTS `TeamData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TeamData` (
  `teamName` varchar(256) NOT NULL,
  `logoUrl` varchar(2048) NOT NULL,
  PRIMARY KEY (`teamName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TeamData`
--

LOCK TABLES `TeamData` WRITE;
/*!40000 ALTER TABLE `TeamData` DISABLE KEYS */;
INSERT INTO `TeamData` VALUES ('Arsenal','https://v2l.cdnsfree.com/sfiles/logo_teams/08a25897e35d75d7261a8095b9599aad.png'),('Aston Villa','https://v2l.cdnsfree.com/sfiles/logo_teams/1976.png'),('Atletico Madrid','https://v2l.cdnsfree.com/sfiles/logo_teams/11551.png'),('Australia (Women)','https://v2l.cdnsfree.com/sfiles/logo_teams/14061.png'),('Bayern Munich','https://v2l.cdnsfree.com/sfiles/logo_teams/d6760659f9d1041cfd6f177b9bedec94.PNG'),('Bournemouth','https://v2l.cdnsfree.com/sfiles/logo_teams/66cc758c57af843283eff5c35867a8c7.png'),('Brentford','https://v2l.cdnsfree.com/sfiles/logo_teams/2064.png'),('Brighton & Hove Albion','https://v2l.cdnsfree.com/sfiles/logo_teams/2026.png'),('Burnley','https://v2l.cdnsfree.com/sfiles/logo_teams/1fdefef8e752eb221b66429cc05daef4.png'),('Cagliari Calcio','https://v2l.cdnsfree.com/sfiles/logo_teams/3546.png'),('Celta','https://v2l.cdnsfree.com/sfiles/logo_teams/fadddef16fb3f0768be2989065e9be6b.png'),('Chelsea','https://v2l.cdnsfree.com/sfiles/logo_teams/4d19a56f7c6e34c48f0f5e0f07bf9ac5.png'),('Cincinnati','https://v2l.cdnsfree.com/sfiles/logo_teams/e5f0b526e100cbb7066c0e97cf082f60.png'),('Crystal Palace','https://v2l.cdnsfree.com/sfiles/logo_teams/2020.png'),('England (Women)','https://v2l.cdnsfree.com/sfiles/logo_teams/14819.png'),('Everton','https://v2l.cdnsfree.com/sfiles/logo_teams/1992.png'),('Fulham','https://v2l.cdnsfree.com/sfiles/logo_teams/1986.png'),('Granada','https://v2l.cdnsfree.com/sfiles/logo_teams/3472.png'),('Hibernian','https://v2l.cdnsfree.com/sfiles/logo_teams/af6e62a30a6f4d987ee548614bb4907b.png'),('Indonesia U23','https://v2l.cdnsfree.com/sfiles/logo_teams/38277.png'),('Inter Miami','https://v2l.cdnsfree.com/sfiles/logo_teams/c90e36c29a220479b55837ef1299093e.png'),('Internazionale Milano','https://v2l.cdnsfree.com/sfiles/logo_teams/284e78c3cca0ded862fbbe1dc58cc5b4.png'),('Laos U23','https://v2l.cdnsfree.com/sfiles/logo_teams/34341.png'),('Liverpool','https://v2l.cdnsfree.com/sfiles/logo_teams/d3916206204ffc91b0471ff9484066d6.png'),('Luton Town','https://v2l.cdnsfree.com/sfiles/logo_teams/2166.png'),('Malaysia U23','https://v2l.cdnsfree.com/sfiles/logo_teams/30003.png'),('Mallorca','https://v2l.cdnsfree.com/sfiles/logo_teams/3478.png'),('Manchester City','https://v2l.cdnsfree.com/sfiles/logo_teams/57060f6368da70fbdfff37cb4b0280a5.png'),('Manchester United','https://v2l.cdnsfree.com/sfiles/logo_teams/1996.png'),('Myanmar U23','https://v2l.cdnsfree.com/sfiles/logo_teams/13897.png'),('Newcastle United','https://v2l.cdnsfree.com/sfiles/logo_teams/16f4b9522ff68b79b088d4c9da0939ee.png'),('Nottingham Forest','https://v2l.cdnsfree.com/sfiles/logo_teams/2022.png'),('Olympique de Marseille','https://v2l.cdnsfree.com/sfiles/logo_teams/27551.png'),('Panathinaikos','https://v2l.cdnsfree.com/sfiles/logo_teams/3006.png'),('Philadelphia Union','https://v2l.cdnsfree.com/sfiles/logo_teams/42e62256a7383ea5c5048125bcd0688c.png'),('PSV Eindhoven','https://v2l.cdnsfree.com/sfiles/logo_teams/8830b5ef7a958db8670ceea57116529d.png'),('Rayo Vallecano','https://v2l.cdnsfree.com/sfiles/logo_teams/3458.png'),('Real Madrid','https://v2l.cdnsfree.com/sfiles/logo_teams/65e3e972954419765c3ce21698edf6cb.png'),('Sevilla','https://v2l.cdnsfree.com/sfiles/logo_teams/3462.png'),('Sheffield United','https://v2l.cdnsfree.com/sfiles/logo_teams/23575.png'),('Spain (Women)','https://v2l.cdnsfree.com/sfiles/logo_teams/14821.png'),('Sturm Graz','https://v2l.cdnsfree.com/sfiles/logo_teams/1832.png'),('Sweden (Women)','https://v2l.cdnsfree.com/sfiles/logo_teams/14703.png'),('Thailand U23','https://v2l.cdnsfree.com/sfiles/logo_teams/29397.png'),('Tottenham Hotspur','https://v2l.cdnsfree.com/sfiles/logo_teams/1984.png'),('Vietnam U23','https://v2l.cdnsfree.com/sfiles/logo_teams/13025.png'),('Villarreal','https://v2l.cdnsfree.com/sfiles/logo_teams/3488.png'),('Werder Bremen','https://v2l.cdnsfree.com/sfiles/logo_teams/c9255853da2a512b273306a46ab09f50.png'),('West Ham United','https://v2l.cdnsfree.com/sfiles/logo_teams/1980.png'),('Wolverhampton Wanderers','https://v2l.cdnsfree.com/sfiles/logo_teams/2058.png');
/*!40000 ALTER TABLE `TeamData` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-30 16:30:09
