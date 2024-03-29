-- MySQL dump 10.13  Distrib 5.7.20, for Linux (x86_64)
--
-- Host: localhost    Database: CCTV_MANAGER
-- ------------------------------------------------------
-- Server version	5.7.20-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `T_ADMINISTRATOR`
--

DROP TABLE IF EXISTS `T_ADMINISTRATOR`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `T_ADMINISTRATOR` (
  `n_ADMIN_ID` int(11) NOT NULL AUTO_INCREMENT,
  `v_LOGIN_ID` varchar(45) NOT NULL,
  `v_PASSWORD` varchar(200) NOT NULL,
  `v_SALT` varchar(45) NOT NULL,
  `v_NAME` varchar(45) DEFAULT NULL,
  `tn_POSITION` tinyint(2) DEFAULT NULL,
  `v_PHONE_NUMBER` varchar(45) DEFAULT NULL,
  `dt_CREATE_DATE` datetime DEFAULT NULL,
  `dt_RECENT_LOGIN` datetime DEFAULT NULL,
  PRIMARY KEY (`n_ADMIN_ID`),
  UNIQUE KEY `v_LOGIN_ID_UNIQUE` (`v_LOGIN_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `T_ADMINISTRATOR`
--

LOCK TABLES `T_ADMINISTRATOR` WRITE;
/*!40000 ALTER TABLE `T_ADMINISTRATOR` DISABLE KEYS */;
INSERT INTO `T_ADMINISTRATOR` VALUES (1,'admin','d88b6ac9a83eb23b40a0f7cde47de0cbc026699b7f07ed4b3d2cd8853b5ae30e38670ccf31696d5cf35d565e2b292e6beffeeeccd90b10f040d4833d2d1f44ac','384863828902','최고관리자',0,'010-0000-0000','2017-11-13 11:02:49','2017-11-13 11:02:49'),(29,'2013147532','93980e883d8ff27029ad568458475fd718db4bc4fbeaf442225d8e675ea953e9eb35c1ce7cad3ab4f303741757478ae3a7a647ee0bc65293b24581ab9e4a516d','458758983479','강영준',1,'010-4948-0042','2017-11-28 14:08:38','2017-11-28 14:08:38'),(30,'2013147543','bd2547ee85091d05bcd94a6c0e0f9cd77f628cbb19bfe0bbb7eac1042ea76d941b3281c7e3d5ba18a7b212aa36abad89ff5b88cbc4176694a4c40474cb6f7482','153061237402','권용태',1,'010-2989-8079','2017-12-03 15:20:21','2017-12-03 15:20:21'),(31,'2013147530','e6ced69cedfd35182bb08842a6343dd66ea440c6e7d164fa7e0b99fc139ff94b64eeea6050b4bfda1f5e651833e26e929cb5ff3cff450cdfa40e49d28f3a5ee6','890784115121','이동용',1,'010-4002-2850','2017-12-07 06:25:53','2017-12-07 06:25:53');
/*!40000 ALTER TABLE `T_ADMINISTRATOR` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `T_CCTV`
--

DROP TABLE IF EXISTS `T_CCTV`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `T_CCTV` (
  `n_CCTV_ID` int(11) NOT NULL AUTO_INCREMENT,
  `v_MODEL` varchar(45) DEFAULT NULL,
  `dt_INSTALL_DATE` datetime DEFAULT NULL,
  `f_LAT` double DEFAULT NULL,
  `f_LNG` double DEFAULT NULL,
  PRIMARY KEY (`n_CCTV_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `T_CCTV`
--

LOCK TABLES `T_CCTV` WRITE;
/*!40000 ALTER TABLE `T_CCTV` DISABLE KEYS */;
INSERT INTO `T_CCTV` VALUES (31,'CCTV_MODEL_1','2017-11-16 00:00:00',37.56169928854789,126.93622291088104),(40,'cctvtest02','2017-02-12 00:00:00',37.56181835452887,126.93629264831543),(47,'씨티삐추','2017-12-13 00:00:00',37.56306853584054,126.93683445453644),(48,'냥냥티비','2017-12-13 00:00:00',37.56226059793506,126.9352251291275),(49,'씨티삐씨티삐','2017-12-05 00:00:00',37.562294616549885,126.9351178407669),(60,'CCTV_MODEL_2','2017-11-16 00:00:00',126.93622291088104,37.56169928854789),(61,'CCTV_MODEL_3','2017-11-16 00:00:00',126.93622291088104,37.56169928854789),(62,'CCTV_MODEL_4','2017-11-16 00:00:00',126.93622291088104,37.56169928854789),(63,'CCTV_MODEL_5','2017-11-16 00:00:00',126.93622291088104,37.56169928854789),(64,'CCTV_MODEL_6','2017-11-16 00:00:00',126.93622291088104,37.56169928854789);
/*!40000 ALTER TABLE `T_CCTV` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `T_COMPOSED`
--

DROP TABLE IF EXISTS `T_COMPOSED`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `T_COMPOSED` (
  `n_SEQ_ID` int(11) NOT NULL,
  `n_NEIGHBOR_ID` int(11) NOT NULL,
  `n_NP_INDEX` int(11) NOT NULL,
  KEY `NEIGHBOR_TO_COMPOSED_idx` (`n_NEIGHBOR_ID`),
  KEY `SEQ_TO_COMPOSED_idx` (`n_SEQ_ID`),
  CONSTRAINT `NEIGHBOR_TO_COMPOSED` FOREIGN KEY (`n_NEIGHBOR_ID`) REFERENCES `T_NEIGHBOR_SPACE` (`n_NEIGHBOR_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SEQ_TO_COMPOSED` FOREIGN KEY (`n_SEQ_ID`) REFERENCES `T_SEQUENCE` (`n_SEQ_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `T_COMPOSED`
--

LOCK TABLES `T_COMPOSED` WRITE;
/*!40000 ALTER TABLE `T_COMPOSED` DISABLE KEYS */;
INSERT INTO `T_COMPOSED` VALUES (33,19,0),(33,17,1);
/*!40000 ALTER TABLE `T_COMPOSED` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `T_METALOG_FILE`
--

DROP TABLE IF EXISTS `T_METALOG_FILE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `T_METALOG_FILE` (
  `v_LOG_FILE_NAME` varchar(200) NOT NULL,
  `v_EXTENSION` varchar(45) DEFAULT NULL,
  `v_MOVIE_FILE_NAME` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`v_LOG_FILE_NAME`),
  KEY `MOVIE_TO_METALOG_idx` (`v_MOVIE_FILE_NAME`),
  CONSTRAINT `MOVIE_TO_METALOG` FOREIGN KEY (`v_MOVIE_FILE_NAME`) REFERENCES `T_MOVIE_FILE` (`v_MOVIE_FILE_NAME`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `T_METALOG_FILE`
--

LOCK TABLES `T_METALOG_FILE` WRITE;
/*!40000 ALTER TABLE `T_METALOG_FILE` DISABLE KEYS */;
INSERT INTO `T_METALOG_FILE` VALUES ('31_대한민국서울특별시서대문구신촌동133제1공학관1층입구앞_2017-12-13T14:02_2017-12-13T14:12_로그.csv','csv','31_대한민국서울특별시서대문구신촌동133제1공학관1층입구앞_2017-12-13T14:02_2017-12-13T14:12.mp4');
/*!40000 ALTER TABLE `T_METALOG_FILE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `T_MOVIE_FILE`
--

DROP TABLE IF EXISTS `T_MOVIE_FILE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `T_MOVIE_FILE` (
  `v_MOVIE_FILE_NAME` varchar(200) NOT NULL,
  `v_EXTENSION` varchar(45) DEFAULT NULL,
  `n_TAKE_SPACE_ID` int(11) DEFAULT NULL,
  `n_CCTV_ID` int(11) DEFAULT NULL,
  `n_ADMIN_ID` int(11) DEFAULT NULL,
  `dt_START_TIME` datetime DEFAULT NULL,
  `dt_END_TIME` datetime DEFAULT NULL,
  PRIMARY KEY (`v_MOVIE_FILE_NAME`),
  KEY `TAKE_SPACE_TO_MOVIE_idx` (`n_TAKE_SPACE_ID`),
  KEY `CCTV_TO_MOVIE_idx` (`n_CCTV_ID`),
  KEY `ADMIN_TO_MOVIE_idx` (`n_ADMIN_ID`),
  CONSTRAINT `ADMIN_TO_MOVIE` FOREIGN KEY (`n_ADMIN_ID`) REFERENCES `T_ADMINISTRATOR` (`n_ADMIN_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CCTV_TO_MOVIE` FOREIGN KEY (`n_CCTV_ID`) REFERENCES `T_CCTV` (`n_CCTV_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `TAKE_SPACE_TO_MOVIE` FOREIGN KEY (`n_TAKE_SPACE_ID`) REFERENCES `T_TAKE_SPACE` (`n_TAKE_SPACE_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `T_MOVIE_FILE`
--

LOCK TABLES `T_MOVIE_FILE` WRITE;
/*!40000 ALTER TABLE `T_MOVIE_FILE` DISABLE KEYS */;
INSERT INTO `T_MOVIE_FILE` VALUES ('31_대한민국서울특별시서대문구신촌동133제1공학관1층입구앞_2017-12-13T14:02_2017-12-13T14:12.mp4','mp4',1451,31,1,'2017-12-13 14:02:00','2017-12-13 14:12:00');
/*!40000 ALTER TABLE `T_MOVIE_FILE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `T_NEIGHBOR_SPACE`
--

DROP TABLE IF EXISTS `T_NEIGHBOR_SPACE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `T_NEIGHBOR_SPACE` (
  `n_NEIGHBOR_ID` int(11) NOT NULL AUTO_INCREMENT,
  `v_NEIGHBOR_NAME` varchar(45) DEFAULT NULL,
  `n_SPACE_1` int(11) NOT NULL,
  `n_SPACE_2` int(11) NOT NULL,
  `n_PATH_ID` int(11) NOT NULL,
  PRIMARY KEY (`n_NEIGHBOR_ID`),
  KEY `SPACE_TO_NEIGHBOR_1_idx` (`n_SPACE_1`),
  KEY `SPACE_TO_NEIGHBOR_2_idx` (`n_SPACE_2`),
  KEY `PATH_TO_NEIGHBOR_idx` (`n_PATH_ID`),
  CONSTRAINT `PATH_TO_NEIGHBOR` FOREIGN KEY (`n_PATH_ID`) REFERENCES `T_PATH` (`n_PATH_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SPACE_TO_NEIGHBOR_1` FOREIGN KEY (`n_SPACE_1`) REFERENCES `T_TAKE_SPACE` (`n_TAKE_SPACE_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SPACE_TO_NEIGHBOR_2` FOREIGN KEY (`n_SPACE_2`) REFERENCES `T_TAKE_SPACE` (`n_TAKE_SPACE_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `T_NEIGHBOR_SPACE`
--

LOCK TABLES `T_NEIGHBOR_SPACE` WRITE;
/*!40000 ALTER TABLE `T_NEIGHBOR_SPACE` DISABLE KEYS */;
INSERT INTO `T_NEIGHBOR_SPACE` VALUES (17,'공학관1공학원',1442,1445,1444),(18,'1공백홀',1441,1446,1447),(19,'3공에서공학원',1454,1442,1444);
/*!40000 ALTER TABLE `T_NEIGHBOR_SPACE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `T_PATH`
--

DROP TABLE IF EXISTS `T_PATH`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `T_PATH` (
  `n_PATH_ID` int(11) NOT NULL AUTO_INCREMENT,
  `v_PATH_NAME` varchar(45) DEFAULT NULL,
  `v_LOCATION` varchar(45) DEFAULT NULL,
  `f_LNG_START` double DEFAULT NULL,
  `f_LAT_START` double DEFAULT NULL,
  `f_LNG_END` double DEFAULT NULL,
  `f_LAT_END` double DEFAULT NULL,
  PRIMARY KEY (`n_PATH_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1450 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `T_PATH`
--

LOCK TABLES `T_PATH` WRITE;
/*!40000 ALTER TABLE `T_PATH` DISABLE KEYS */;
INSERT INTO `T_PATH` VALUES (1444,'이름3','위치3',126.9350802898407,37.56172055034416,126.93544507026672,37.56078502556818),(1445,'공학원투백양홀','위치',126.93539679050446,37.56087857857442,126.93812191486359,37.562009710171054),(1446,'경로12','위치12',126.93621218204498,37.561831111586955,126.93531095981598,37.56220531765283),(1447,'1공에서백콘','1공에서백콘사이',126.93615853786469,37.56176307391851,126.93797171115875,37.56209475696536),(1448,'공2-공3','서울랜드',126.93523585796356,37.56172055034416,126.9352251291275,37.562332887472984),(1449,'공원투백','공원투백',126.93582594394684,37.56079353039178,126.93798243999481,37.56207774761426);
/*!40000 ALTER TABLE `T_PATH` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `T_SEQUENCE`
--

DROP TABLE IF EXISTS `T_SEQUENCE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `T_SEQUENCE` (
  `n_SEQ_ID` int(11) NOT NULL AUTO_INCREMENT,
  `v_SEQ_NAME` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`n_SEQ_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `T_SEQUENCE`
--

LOCK TABLES `T_SEQUENCE` WRITE;
/*!40000 ALTER TABLE `T_SEQUENCE` DISABLE KEYS */;
INSERT INTO `T_SEQUENCE` VALUES (33,'tltl');
/*!40000 ALTER TABLE `T_SEQUENCE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `T_STATISTICS`
--

DROP TABLE IF EXISTS `T_STATISTICS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `T_STATISTICS` (
  `v_LOG_FILE_NAME` varchar(200) NOT NULL,
  `n_RECORD_NUM` int(11) DEFAULT NULL,
  `n_LENGTH` int(11) DEFAULT NULL,
  `n_OBJECT_NUM` int(11) DEFAULT NULL,
  `f_AVG_COLOR_R` float DEFAULT NULL,
  `f_AVG_COLOR_G` float DEFAULT NULL,
  `f_AVG_COLOR_B` float DEFAULT NULL,
  `f_AVG_SIZE_X` float DEFAULT NULL,
  `f_AVG_SIZE_Y` float DEFAULT NULL,
  `f_AVG_SPEED_X` float DEFAULT NULL,
  `f_AVG_SPEED_Y` float DEFAULT NULL,
  `f_AVG_POSITION_X` float DEFAULT NULL,
  `f_AVG_POSITION_Y` float DEFAULT NULL,
  PRIMARY KEY (`v_LOG_FILE_NAME`),
  CONSTRAINT `LOG_TO_STATISTICS` FOREIGN KEY (`v_LOG_FILE_NAME`) REFERENCES `T_METALOG_FILE` (`v_LOG_FILE_NAME`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `T_STATISTICS`
--

LOCK TABLES `T_STATISTICS` WRITE;
/*!40000 ALTER TABLE `T_STATISTICS` DISABLE KEYS */;
INSERT INTO `T_STATISTICS` VALUES ('31_대한민국서울특별시서대문구신촌동133제1공학관1층입구앞_2017-12-13T14:02_2017-12-13T14:12_로그.csv',602,381,10,126.346,129.463,121.988,147.11,139.684,44.8505,46.0797,491.761,494.718);
/*!40000 ALTER TABLE `T_STATISTICS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `T_SUPERVISE`
--

DROP TABLE IF EXISTS `T_SUPERVISE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `T_SUPERVISE` (
  `n_ADMIN_ID` int(11) NOT NULL,
  `n_CCTV_ID` int(11) NOT NULL,
  KEY `ADMIN_TO_SUP_idx` (`n_ADMIN_ID`),
  KEY `CCTV_TO_SUP_idx` (`n_CCTV_ID`),
  CONSTRAINT `ADMIN_TO_SUP` FOREIGN KEY (`n_ADMIN_ID`) REFERENCES `T_ADMINISTRATOR` (`n_ADMIN_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CCTV_TO_SUP` FOREIGN KEY (`n_CCTV_ID`) REFERENCES `T_CCTV` (`n_CCTV_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `T_SUPERVISE`
--

LOCK TABLES `T_SUPERVISE` WRITE;
/*!40000 ALTER TABLE `T_SUPERVISE` DISABLE KEYS */;
INSERT INTO `T_SUPERVISE` VALUES (1,31),(29,40),(30,40),(1,40),(1,47),(29,47),(30,31),(30,47),(29,48),(30,48),(1,48),(29,49),(1,49),(31,40),(1,60),(1,61),(1,62),(1,63),(1,64);
/*!40000 ALTER TABLE `T_SUPERVISE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `T_TAKE`
--

DROP TABLE IF EXISTS `T_TAKE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `T_TAKE` (
  `n_CCTV_ID` int(11) NOT NULL,
  `n_TAKE_SPACE_ID` int(11) NOT NULL,
  KEY `CCTV_TO_TAKE_idx` (`n_CCTV_ID`),
  KEY `TAKE_SPACE_TO_TAKE_idx` (`n_TAKE_SPACE_ID`),
  CONSTRAINT `CCTV_TO_TAKE` FOREIGN KEY (`n_CCTV_ID`) REFERENCES `T_CCTV` (`n_CCTV_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `TAKE_SPACE_TO_TAKE` FOREIGN KEY (`n_TAKE_SPACE_ID`) REFERENCES `T_TAKE_SPACE` (`n_TAKE_SPACE_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `T_TAKE`
--

LOCK TABLES `T_TAKE` WRITE;
/*!40000 ALTER TABLE `T_TAKE` DISABLE KEYS */;
INSERT INTO `T_TAKE` VALUES (31,1441),(31,1451),(40,1441),(47,1441),(48,1445),(48,1446),(48,1447),(48,1448),(48,1449),(48,1450),(48,1451),(48,1454),(49,1441),(40,1451);
/*!40000 ALTER TABLE `T_TAKE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `T_TAKE_SPACE`
--

DROP TABLE IF EXISTS `T_TAKE_SPACE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `T_TAKE_SPACE` (
  `n_TAKE_SPACE_ID` int(11) NOT NULL AUTO_INCREMENT,
  `v_ADDRESS` varchar(45) DEFAULT NULL,
  `v_BUILDING` varchar(45) DEFAULT NULL,
  `v_FLOOR` varchar(45) DEFAULT NULL,
  `v_SITE` varchar(45) DEFAULT NULL,
  `f_LAT` float DEFAULT NULL,
  `f_LNG` float DEFAULT NULL,
  PRIMARY KEY (`n_TAKE_SPACE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1457 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `T_TAKE_SPACE`
--

LOCK TABLES `T_TAKE_SPACE` WRITE;
/*!40000 ALTER TABLE `T_TAKE_SPACE` DISABLE KEYS */;
INSERT INTO `T_TAKE_SPACE` VALUES (1441,'대한민국 서울특별시 신촌동 ','연세대학교 제1공학관','1층','현관앞',37.5618,126.936),(1442,'대한민국 서울특별시 연희동 ','연세대학교 제3공학관','1층','현관앞',37.5617,126.935),(1445,'대한민국 서울특별시 창천동 ','연세대학교 공학원','1층','로비',37.5608,126.936),(1446,'대한민국 서울특별시 신촌동 ','연세대학교 백주년기념관','1층','현관앞',37.5621,126.938),(1447,'대한민국 서울특별시 신촌동 ','연세대학교 체육관','1층','로비',37.5631,126.936),(1448,'대한민국 서울특별시 신촌동 ','연세대학교 백양관','2층','로비',37.5647,126.938),(1449,'대한민국 서울특별시 서대문구 신촌동 131','우리은행','1층','atm앞',37.5633,126.938),(1450,'대한민국 서울특별시 신촌동 ','연세대학교 의과대학','1층','화장실앞',37.5609,126.94),(1451,'대한민국 서울특별시 서대문구 신촌동 133','제1공학관','1층','입구앞',37.5617,126.937),(1454,'대한민국 서울특별시 창천동 ','연세대학교 공학원','3층','계단앞',37.5608,126.936);
/*!40000 ALTER TABLE `T_TAKE_SPACE` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-12-07 16:49:31
