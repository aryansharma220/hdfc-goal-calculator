-- CreateTable
CREATE TABLE `Goal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `goalName` VARCHAR(191) NOT NULL,
    `currentCost` DOUBLE NOT NULL,
    `years` INTEGER NOT NULL,
    `inflation` DOUBLE NOT NULL,
    `expectedReturns` DOUBLE NOT NULL,
    `futureValue` DOUBLE NOT NULL,
    `monthlySIP` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
