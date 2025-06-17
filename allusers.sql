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
-- База даних: `users`
--

-- --------------------------------------------------------

--
-- Структура таблиці `allusers`
--

CREATE TABLE `allusers` (
  `id` int(11) NOT NULL,
  `login` varchar(25) NOT NULL,
  `pass` varchar(25) NOT NULL,
  `email` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `allusers`
--

INSERT INTO `allusers` (`id`, `login`, `pass`, `email`) VALUES
(1, 'qwqwqw', 'qwqwq', 'qwqq'),
(2, 'as', 'asas', 'as'),
(3, 'as', 'asas', 'as'),
(4, 'sdsdsdsd', 'asassdsd', 'assdsdsd'),
(5, 'gandon', 'asassdsd', 'assdsdsd'),
(6, 'gandon', 'asassdsd', 'assdsdsd'),
(7, 'gandon', 'asassdsd', 'assdsdsd'),
(8, 'gandon', 'asassdsd', 'assdsdsd'),
(9, 'danyapenis', 'danyapenis', 'danyapenis'),
(10, 'danyapenis', 'danyapenis', 'danyapenis'),
(11, 'danyapenis', 'danyapenis', 'danyapenis'),
(12, 'danyapenis', 'danyapenis', 'danyapenis'),
(13, 'danyapenis', 'danyapenis', 'danyapenis'),
(14, 'danyapenis', 'danyapenis', 'danyapenis'),
(15, 'danyapenis', 'danyapenis', 'danyapenis'),
(16, 'danyapenis', 'danyapenis', 'danyapenis'),
(17, 'danyapenis', 'danyapenis', 'danyapenis'),
(18, 'йцй', 'цйц', 'цй'),
(19, 'оілтивлоіов', 'івівів', 'ві'),
(20, 'вфтвф', 'фыф', 'й'),
(21, '', '', ''),
(22, '', 's', ''),
(23, '', '', ''),
(24, '', '', ''),
(25, '', '', ''),
(26, '', '', ''),
(27, '', '', ''),
(28, 'q', 'q', ''),
(29, '', '', ''),
(30, '', '', ''),
(31, 'danylo', 'Asasa2424', 'danya@gmail'),
(32, 'ЙЙ', 'Lфі221', 'фіфіф@'),
(33, 'qswa', 'Qwqw12', 'qww@'),
(34, 'anus', 'Anus228', 'anus228@gmail'),
(35, 'VITALYA', 'Asd123', 'vitalya@gmail'),
(36, 'd', 'D2', 'd@'),
(37, 'qww', 'QW1', 'qw@'),
(38, 'qww', 'QW1', 'qw@'),
(39, 'qww', 'QW1', 'qw@'),
(40, 'qw', 'QW1', 'qw@'),
(41, 'qw', 'QW2', 'qw@'),
(42, 'q', 'QW2', 'qwe@'),
(43, 'q', 'QW2', 'qwe@'),
(44, 'q', 'QW2', 'qwe@'),
(45, 'q', 'QW2', 'qwe@'),
(46, 'q', 'QW2', 'qwe@'),
(47, 'q', 'QW2', 'qwe@'),
(48, 'q', 'QW2', 'qw@'),
(49, 'q', 'QW2', 'qw@'),
(50, 'q', 'QW2', 'qw@'),
(51, 'q', 'QW2', 'qw@'),
(52, 'q', 'QW2', 'qw@'),
(53, 'q', 'QW2', 'qw@'),
(54, 'q', 'QW2', 'qw@'),
(55, 'q', 'QW2', 'qw@'),
(56, 'q', 'QW2', 'qw@'),
(57, 'qwqw', 'QWQW2', 'QW@'),
(58, 'aa', 'AA2', 'aa@'),
(59, 'aa', 'AA2', 'aa@'),
(60, 'aa', 'AA2', 'aa@'),
(61, 'aa', 'AA2', 'aa@'),
(62, 'aa', 'AA2', 'aa@'),
(63, 'aa', 'AA2', 'aa@'),
(64, 'aa', 'AA2', 'aa@'),
(65, 'aa', 'AA2', 'aa@'),
(66, 'aa', 'AA2', 'aa@'),
(67, 'aa', 'AA2', 'aa@'),
(68, 'aa', 'AA2', 'aa@'),
(69, 'aa', 'AA2', 'aa@'),
(70, 'aa', 'AA2', 'aa@'),
(71, 'aa', 'AA2', 'aa@'),
(72, 'aa', 'AA2', 'aa@'),
(73, 'aa', 'AA2', 'aa@'),
(74, 'aa', 'AA2', 'aa@'),
(75, 'aa', 'AA2', 'aa@'),
(76, 'aa', 'AA2', 'aa@'),
(77, 'aa', 'AA2', 'aa@'),
(78, 'aa', 'AA2', 'aa@'),
(79, 'aa', 'AA2', 'aa@'),
(80, 'aa', 'AA2', 'aa@'),
(81, 'aa', 'AA2', 'aa@'),
(82, 'aa', 'AA2', 'aa@'),
(83, 'danylo', 'Asass25', 'asa@'),
(84, 'Danya', 'Asass252', 'asas@');

--
-- Індекси збережених таблиць
--

--
-- Індекси таблиці `allusers`
--
ALTER TABLE `allusers`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для збережених таблиць
--

--
-- AUTO_INCREMENT для таблиці `allusers`
--
ALTER TABLE `allusers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
