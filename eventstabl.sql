-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Час створення: Чрв 17 2025 р., 18:15
-- Версія сервера: 10.4.32-MariaDB
-- Версія PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База даних: `events`
--

-- --------------------------------------------------------

--
-- Структура таблиці `eventstabl`
--

CREATE TABLE `eventstabl` (
  `id` int(11) NOT NULL,
  `login` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `type` varchar(255) NOT NULL,
  `local` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `eventstabl`
--

INSERT INTO `eventstabl` (`id`, `login`, `name`, `date`, `time`, `type`, `local`, `description`, `image`) VALUES
(1, 'q', 'Concert Danya Penisss', '2025-02-02', '09:46:00', 'Concert', '', 'Concert Danya Penisss', '684f1523da57c_ййц.jpg'),
(2, 'q', 'Concert Danya Penisss', '2025-02-02', '10:50:00', 'Concert', '', 'Concert Danya Penisss', 'uploads/684f15f2eded1_photo_2025-04-30_12-02-35 (2).jpg'),
(3, 'q', 'Concert Danya Penisss', '2025-02-02', '10:50:00', 'Concert', '', 'Concert Danya Penisss', 'uploads/684f1797a505d_photo_2025-04-30_12-02-35 (2).jpg'),
(4, 'q', 'Concert Danya Penisss', '2025-02-02', '10:50:00', 'Concert', '', 'Concert Danya Penisss', 'uploads/684f17ab189d6_photo_2025-04-30_12-02-35 (2).jpg'),
(5, 'q', 'Concert Danya Penisss', '2025-02-02', '10:50:00', 'Concert', '', 'Concert Danya Penisss', 'uploads/684f17b27270f_photo_2025-04-30_12-02-35 (2).jpg'),
(6, 'q', 'Concert Danya Penisss', '2025-02-02', '10:50:00', 'Concert', '', 'Concert Danya Penisss', 'uploads/684f19dd75e60_photo_2025-04-30_12-02-35 (2).jpg'),
(7, 'q', 'Concert Danya Penisss', '2025-02-02', '10:50:00', 'Concert', '', 'Concert Danya Penisss', 'uploads/684f19dda075d_photo_2025-04-30_12-02-35 (2).jpg'),
(8, 'q', 'йц', '2025-02-02', '11:07:00', 'Concert', '', 'йцйц', 'uploads/684f19f2744c3_6pkF6j5UfTGW0V5slLKoi7fS72vGDrE_YPYhoX0Iyczg5OoBDUX4raGoP4lq9QJV4pXrmLoJfgB4soBc-Wi-l93l85rlILbn0-F7.avif'),
(9, 'q', 'йц', '2025-02-02', '11:07:00', 'Concert', '', 'йцйц', 'uploads/684f19f3ee7e3_6pkF6j5UfTGW0V5slLKoi7fS72vGDrE_YPYhoX0Iyczg5OoBDUX4raGoP4lq9QJV4pXrmLoJfgB4soBc-Wi-l93l85rlILbn0-F7.avif'),
(10, 'q', 'йц', '2025-02-02', '11:07:00', 'Concert', '', 'йцйц', 'uploads/684f19f41fb8d_6pkF6j5UfTGW0V5slLKoi7fS72vGDrE_YPYhoX0Iyczg5OoBDUX4raGoP4lq9QJV4pXrmLoJfgB4soBc-Wi-l93l85rlILbn0-F7.avif'),
(11, 'q', 'йц', '2025-02-02', '11:07:00', 'Concert', '', 'йцйц', 'uploads/684f19f4689f3_6pkF6j5UfTGW0V5slLKoi7fS72vGDrE_YPYhoX0Iyczg5OoBDUX4raGoP4lq9QJV4pXrmLoJfgB4soBc-Wi-l93l85rlILbn0-F7.avif'),
(12, 'q', 'йц', '2025-02-02', '11:07:00', 'Concert', '', 'йцйц', 'uploads/684f19f48cbe2_6pkF6j5UfTGW0V5slLKoi7fS72vGDrE_YPYhoX0Iyczg5OoBDUX4raGoP4lq9QJV4pXrmLoJfgB4soBc-Wi-l93l85rlILbn0-F7.avif'),
(13, 'q', 'qwqw', '2025-06-01', '09:10:00', 'Concert', '', 'qwq', 'uploads/684f1aaaaeb3c_photo_2025-02-06_23-14-13.jpg'),
(14, 'q', 'qwqw', '2025-06-01', '09:10:00', 'Concert', '', 'qwq', 'uploads/684f1aab6d1b3_photo_2025-02-06_23-14-13.jpg'),
(15, 'q', 'qwqw', '2025-06-01', '09:10:00', 'Concert', '', 'qwq', 'uploads/684f1aab8f83c_photo_2025-02-06_23-14-13.jpg'),
(16, 'q', 'qwqw', '2025-06-01', '09:10:00', 'Concert', '', 'qwq', 'uploads/684f1aabac2da_photo_2025-02-06_23-14-13.jpg'),
(17, 'q', 'qwqw', '2025-06-01', '09:10:00', 'Concert', '', 'qwq', 'uploads/684f1aabcd221_photo_2025-02-06_23-14-13.jpg'),
(18, 'q', 'qwqw', '2025-06-01', '09:10:00', 'Concert', '', 'qwq', 'uploads/684f1ac70fe40_photo_2025-02-06_23-14-13.jpg'),
(19, 'q', 'qw', '2025-06-09', '23:11:00', 'Concert', '', 'qw', 'uploads/684f1ad0e7bff_WHeOu95nW2SZQy6H5IKgE2Bg.webp'),
(20, 'q', 'qw', '2025-06-09', '23:11:00', 'Concert', '', 'qw', 'uploads/684f1ad17eff7_WHeOu95nW2SZQy6H5IKgE2Bg.webp'),
(21, 'q', 'qw', '2025-06-09', '23:11:00', 'Concert', '', 'qw', 'uploads/684f1ad19de8f_WHeOu95nW2SZQy6H5IKgE2Bg.webp'),
(22, 'q', 'qw', '2025-06-09', '23:11:00', 'Concert', '', 'qw', 'uploads/684f1ad1bcc27_WHeOu95nW2SZQy6H5IKgE2Bg.webp'),
(23, 'q', 'qw', '2025-06-09', '23:11:00', 'Concert', '', 'qw', 'uploads/684f1ad1e1b77_WHeOu95nW2SZQy6H5IKgE2Bg.webp'),
(24, 'q', 'qw', '2025-06-09', '23:11:00', 'Concert', '', 'qw', 'uploads/684f1ad2106f9_WHeOu95nW2SZQy6H5IKgE2Bg.webp'),
(25, 'q', 'qw', '2025-06-09', '23:11:00', 'Concert', '', 'qw', 'uploads/684f1ad233cb8_WHeOu95nW2SZQy6H5IKgE2Bg.webp'),
(26, 'q', 'qw', '2025-06-02', '22:12:00', 'Concert', '', 'qwq', 'uploads/684f1b11ad711_ass.jpg'),
(27, 'q', 'DanyaPenisss', '2025-06-02', '11:55:00', 'Concert', '', 'DanyaPenisss', 'uploads/684f334156ea0_photo_2025-04-30_12-43-06.jpg'),
(28, 'q', 'DanyaPenisss', '2025-06-02', '11:55:00', 'Concert', '', 'DanyaPenisss', 'uploads/684f341e5a612_photo_2025-04-30_12-43-06.jpg'),
(29, 'q', 'qwqw', '2025-06-02', '10:01:00', 'Concert', '', 'asasas', 'uploads/684f342f50829_photo_2025-04-30_12-02-35 (2).jpg'),
(30, 'q', 'qwqw', '2025-06-02', '11:02:00', 'Concert', '', 'qw', 'uploads/684f34b7d55e8_ййц.jpg'),
(31, 'q', 'йцйцйцй', '2025-06-02', '11:05:00', 'Concert', '', 'йцйц', 'uploads/684f354f95177_photo_2025-02-20_23-35-37.jpg'),
(32, 'd', 'd', '2025-02-16', '17:46:00', 'Concert', '', 'd', 'uploads/68503c5973ad0_c0ef969e61849dff2d84b9b0c97b0ea1.webp'),
(33, 'd', 'й', '2025-06-02', '17:51:00', 'Concert', '', 'й', 'uploads/68503d11ebb54_81LcQaX+bfL._AC_UF1000,1000_QL80_.jpg'),
(34, 'd', 'й', '2025-06-02', '18:50:00', 'Concert', '', 'й', 'uploads/68503d30d1ffa_81LcQaX+bfL._AC_UF1000,1000_QL80_.jpg'),
(35, 'd', 'й', '2025-06-03', '05:50:00', 'Concert', '', 'й', 'uploads/68503d4aaccc7_lRTo0hCKvp4tflD3BIvHfXcl.avif'),
(36, 'd', 'й', '2025-06-02', '17:52:00', 'Concert', '', 'й', 'uploads/68503d800d603_81LcQaX+bfL._AC_UF1000,1000_QL80_.jpg'),
(37, 'd', 'q', '2025-06-03', '18:58:00', 'Concert', '', 'q', 'uploads/68503f407dd93_81LcQaX+bfL._AC_UF1000,1000_QL80_.jpg'),
(38, 'd', 'q', '2025-06-04', '17:01:00', 'Concert', '', 'q', 'uploads/68503f4cde193_81LcQaX+bfL._AC_UF1000,1000_QL80_.jpg'),
(39, 'd', 'q', '2025-06-03', '19:00:00', 'Concert', '', 'q', 'uploads/68503f976b13d_81LcQaX+bfL._AC_UF1000,1000_QL80_.jpg'),
(40, 'd', 'q', '2025-06-04', '18:02:00', 'Concert', '', 'q', 'uploads/68503fef27b37_81LcQaX+bfL._AC_UF1000,1000_QL80_.jpg'),
(41, 'd', 'q', '2025-06-01', '18:03:00', 'Concert', '', 'q', 'uploads/6850400b60e59_lRTo0hCKvp4tflD3BIvHfXcl.avif'),
(42, 'd', 'q', '2025-06-03', '18:03:00', 'Concert', '', 'q', 'uploads/68504025cdaca_81LcQaX+bfL._AC_UF1000,1000_QL80_.jpg'),
(43, 'd', 'q', '2025-06-02', '18:03:00', 'Concert', '', 'q', 'uploads/685040373c0a6_6pkF6j5UfTGW0V5slLKoi7fS72vGDrE_YPYhoX0Iyczg5OoBDUX4raGoP4lq9QJV4pXrmLoJfgB4soBc-Wi-l93l85rlILbn0-F7.avif'),
(44, 'd', 'q', '2025-06-04', '18:05:00', 'Concert', '', 'q', 'uploads/685040466c9a5_Діаграма без назви.drawio.png'),
(45, 'd', 'q', '2025-06-02', '18:04:00', 'Concert', '', 'q', 'uploads/6850405e9d4ed_Rodeo_Travis_Scott_Expanded.png'),
(46, 'danylo', 'DANYAPENISSS FIRST CONCERT ', '2025-02-16', '20:29:00', 'Concert', '', 'Перший концерт такого українського репера як ДаняПеніс', 'uploads/685062a316f83_photo_2025-02-20_23-35-37.jpg'),
(47, 'q', 'йц', '2025-06-02', '01:17:00', 'Concert', '', 'й', 'uploads/6850a5f41d123_ййц.jpg'),
(48, 'q', 'й', '2025-06-02', '02:19:00', 'Concert', '', 'й', 'uploads/6850a67c4f993_photo_2025-02-06_23-14-13.jpg'),
(49, 'q', 'й', '2025-06-03', '02:20:00', 'Concert', '', 'й', 'uploads/6850a6da113a8_Карта України.png'),
(50, 'qwqw', 'DANYAPENISSS FIRST CONCERT', '2025-05-09', '01:22:00', 'Concert', '', 'DANYAPENISSS FIRST CONCERT', 'uploads/685141ff4fed2_photo_2024-12-07_20-56-45.jpg'),
(51, 'qwqw', 'q', '2025-06-10', '12:32:00', 'Concert', 'Toruń', 'q', 'uploads/685144a8311a6_ййц.jpg'),
(52, 'Danya', 'Konferencja we Wroclawiu', '2025-06-19', '06:33:00', 'Concert', 'Wrocław', 'Konferencja we Wroclawiu', 'uploads/68518af0327a9_ChatGPT Image 17 черв. 2025 р., 15_34_59.png');

--
-- Індекси збережених таблиць
--

--
-- Індекси таблиці `eventstabl`
--
ALTER TABLE `eventstabl`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для збережених таблиць
--

--
-- AUTO_INCREMENT для таблиці `eventstabl`
--
ALTER TABLE `eventstabl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
