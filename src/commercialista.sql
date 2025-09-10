-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Gen 31, 2025 alle 12:39
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `commercialista`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `clienti`
--

CREATE TABLE `clienti` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `cognome` varchar(255) NOT NULL,
  `data_nascita` date NOT NULL,
  `indirizzo` varchar(255) DEFAULT NULL,
  `codice_fiscale` varchar(16) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `località` varchar(255) DEFAULT NULL,
  `Provincia` varchar(255) DEFAULT NULL,
  `luogo_di_nascita` varchar(255) DEFAULT NULL,
  `cap` varchar(10) DEFAULT NULL,
  `data_pratica` date DEFAULT NULL,
  `ragione_sociale` varchar(255) DEFAULT NULL,
  `sdi_pec` varchar(255) DEFAULT NULL,
  `numero_carta_identita` varchar(50) DEFAULT NULL,
  `numero_da_migrare1` varchar(50) DEFAULT NULL,
  `codice_di_migrazione1` varchar(50) DEFAULT NULL,
  `Operatore_Cedente1` varchar(255) DEFAULT NULL,
  `tipologia1` varchar(255) DEFAULT NULL,
  `numero_da_migrare2` varchar(50) DEFAULT NULL,
  `codice_di_migrazione2` varchar(50) DEFAULT NULL,
  `Operatore_Cedente2` varchar(255) DEFAULT NULL,
  `tipologia2` varchar(255) DEFAULT NULL,
  `numero_da_migrare3` varchar(50) DEFAULT NULL,
  `codice_di_migrazione3` varchar(50) DEFAULT NULL,
  `Operatore_Cedente3` varchar(255) DEFAULT NULL,
  `tipologia3` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `luogo_pratica` varchar(255) DEFAULT NULL,
  `rilasciato_da` varchar(255) DEFAULT NULL,
  `n_revoip1000` int(3) DEFAULT NULL,
  `n_revoipchagg` int(3) DEFAULT NULL,
  `costo_attivazione` decimal(5,2) DEFAULT NULL,
  `canone_mensile` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `clienti`
--

INSERT INTO `clienti` (`id`, `nome`, `cognome`, `data_nascita`, `indirizzo`, `codice_fiscale`, `email`, `telefono`, `località`, `Provincia`, `luogo_di_nascita`, `cap`, `data_pratica`, `ragione_sociale`, `sdi_pec`, `numero_carta_identita`, `numero_da_migrare1`, `codice_di_migrazione1`, `Operatore_Cedente1`, `tipologia1`, `numero_da_migrare2`, `codice_di_migrazione2`, `Operatore_Cedente2`, `tipologia2`, `numero_da_migrare3`, `codice_di_migrazione3`, `Operatore_Cedente3`, `tipologia3`, `note`, `luogo_pratica`, `rilasciato_da`, `n_revoip1000`, `n_revoipchagg`, `costo_attivazione`, `canone_mensile`) VALUES
(29, 'Kuame West', 'Armstrong', '1974-10-19', 'Doloribus non vel in', 'Nisi ut molestia', 'pihy@mailinator.com', '+1 (814) 949-2342', 'Natus illum quis in', 'Provident consequun', 'Aute ut itaque perfe', 'Officiis r', '1977-12-25', 'Porro magnam maiores', 'Ut voluptas ratione ', 'Dicta et tempore ve', 'Repudiandae ex volup', 'Est veniam lorem la', 'Esse in quos soluta ', 'Enim velit est volu', 'Sequi quaerat quis c', 'Corrupti deleniti a', 'Sapiente sit qui tem', 'Harum id enim veniam', 'Veniam provident e', 'Laboriosam vero qua', 'Facilis occaecat et ', 'Dolores minim veniam', 'Quaerat perferendis ', 'Fugit necessitatibu', NULL, NULL, NULL, NULL, NULL),
(30, 'Kameko Chen', 'Gross', '1996-09-16', 'Est libero quis cons', 'Exercitationem s', 'waru@mailinator.com', '+1 (459) 749-9794', 'Consequatur in est ', 'Qui irure sed et odi', 'Aute ea eveniet del', 'Odit inven', '1970-03-04', 'Similique rem aut ea', 'Qui autem quas tempo', 'Et eos lorem molest', 'Fuga Rerum eiusmod ', 'Ut laboris nihil off', 'Quia elit omnis nob', 'Voluptatem Repudian', 'Temporibus dolorem l', 'Eu sit quibusdam cul', 'Ad eveniet beatae f', 'Omnis id aut officia', 'Qui odit ut ea conse', 'Asperiores non rerum', 'Consequatur Itaque ', 'Beatae fugiat sit ', 'Voluptas magni volup', 'Est non aut irure raaaaaaaaaaaaaaa', '', 0, 0, 0.00, 15.00),
(32, 'Mario', 'Rossi', '1990-06-24', 'Via Roma 1', 'RSSMRA90A01H501Z', 'mario@example.com', '1234567890', 'Milano', 'MI', 'Roma', '20100', '2024-01-01', 'Impresa SRL', 'mario@pec.it', '12345678', '', '', '', '', '', '', '', '', '', '', '', '', 'Cliente importante', 'Milano', '0', 3, 3, 12.50, 12.99),
(35, 'Recusandae Velit nu', 'Voluptatem expedita ', '1995-03-22', 'Magna itaque amet q', 'Do illo nisi min', 'serena.siliberti@gmail.com', 'Facere aut ullam occ', 'Laudantium alias de', 'Dolore soluta incidu', 'Ipsa quo non minus ', 'Qui alias ', '1983-08-12', 'Quos quaerat ullamco', 'Eaque reprehenderit', 'Dolorem id nostrud s', 'Magnam sunt unde dol', 'Vel veritatis vitae ', 'Impedit a omnis min', 'Nulla cupiditate rat', 'Ullam obcaecati in a', 'Saepe duis accusamus', 'Quia impedit labori', 'Exercitation consequ', 'Sed temporibus culpa', 'Fugiat quaerat volu', 'Fugit vitae et veli', 'Velit perspiciatis ', 'Alias vel totam cons', 'Quibusdam voluptas t', '0', 1, 2, 13.50, 13.66),
(36, 'Serena', 'Siliberti', '2025-01-08', 'Via Tommaso Salvemini 2', 'SLBSRN90L61A662P', 'serena.siliberti@gmail.com', '3403940206', 'molfetta', 'BA', 'bari', '70056', '2025-01-31', 'prova', '1222', 'Autem qui accusamus ', '1234567890', '1234567890', 'ciao', 'ciao', '12345678900', '1234567890', 'ciao1', 'ciao', '1234567890', '1234567890', 'ciao3', 'ciao3', 'ciao', 'bari', '0', 1, 1, 15.00, 15.00),
(37, 'Excepteur dolor even', 'Ea nemo id ea quaera', '2018-08-16', 'Officia quia aut aut', 'Sit eius volupta', 'seqip@mailinator.com', 'Placeat aut magnam ', 'Veniam eum pariatur', 'Sed necessitatibus n', 'Ut quas porro aut od', 'Labore sap', '1996-10-25', 'Qui ex ratione ad do', 'Id possimus cum ill', 'Optio Nam mollitia ', 'Expedita inventore e', 'Voluptas voluptas en', 'Ea consequuntur aut ', 'Labore irure dolores', 'Labore harum anim au', 'Quod aute aut cum er', 'Facilis nihil id aut', 'Corrupti mollit ali', 'Dolore culpa exerci', 'Sint totam quo velit', 'Sint accusamus ex et', 'Ratione beatae qui i', 'Rem expedita qui qui', 'Esse nihil dolor iur', '0', 13, 13, 12.00, 15.00);

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `utente` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`id`, `utente`, `password`) VALUES
(1, 'prova', '$2y$10$s0FZAHkF/938YmCsjquGyO2Ox4jDPy9eJc.sVyLz7AISyM6ma3K9S');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `clienti`
--
ALTER TABLE `clienti`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codice_fiscale` (`codice_fiscale`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `utente` (`utente`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `clienti`
--
ALTER TABLE `clienti`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
