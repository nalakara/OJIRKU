package com.ojirku.app.data

import android.content.Context
import androidx.room.*

enum class TransactionType {
    INCOME,
    EXPENSE
}

@Entity(tableName = "transactions")
data class TransactionEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val type: String, // INCOME or EXPENSE
    val amount: Double,
    val categoryId: Long,
    val accountId: Long,
    val date: Long, // timestamp
    val description: String
)

@Entity(tableName = "categories")
data class CategoryEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val type: String // INCOME or EXPENSE
)

@Entity(tableName = "accounts")
data class AccountEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val type: String, // Bank, Cash, Credit Card, Investment, E-Wallet
    val initialBalance: Double
)

@Entity(tableName = "goals")
data class GoalEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val targetAmount: Double,
    val currentAmount: Double,
    val deadline: Long? = null
)

@Entity(tableName = "budgets")
data class BudgetEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val categoryId: Long,
    val amount: Double,
    val period: String // monthly, yearly
)

@Entity(tableName = "debts")
data class DebtEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val lender: String,
    val totalAmount: Double,
    val amountPaid: Double,
    val dueDate: Long? = null,
    val interestRate: Double? = null
)

@Entity(tableName = "debt_payments")
data class DebtPaymentEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val debtId: Long,
    val accountId: Long,
    val amount: Double,
    val date: Long
)

@Entity(tableName = "settings")
data class SettingEntity(
    @PrimaryKey val key: String,
    val value: String
)

@Dao
interface FinanceDao {
    @Query("SELECT * FROM transactions ORDER BY date DESC")
    suspend fun getTransactions(): List<TransactionEntity>

    @Insert
    suspend fun insertTransaction(tx: TransactionEntity): Long

    @Update
    suspend fun updateTransaction(tx: TransactionEntity)

    @Delete
    suspend fun deleteTransaction(tx: TransactionEntity)

    @Query("SELECT * FROM categories")
    suspend fun getCategories(): List<CategoryEntity>

    @Insert
    suspend fun insertCategories(categories: List<CategoryEntity>)

    @Insert
    suspend fun insertCategory(category: CategoryEntity): Long

    @Update
    suspend fun updateCategory(category: CategoryEntity)

    @Delete
    suspend fun deleteCategory(category: CategoryEntity)

    @Query("SELECT * FROM accounts")
    suspend fun getAccounts(): List<AccountEntity>

    @Insert
    suspend fun insertAccounts(accounts: List<AccountEntity>)

    @Insert
    suspend fun insertAccount(account: AccountEntity): Long

    @Update
    suspend fun updateAccount(account: AccountEntity)

    @Delete
    suspend fun deleteAccount(account: AccountEntity)

    @Query("SELECT * FROM goals")
    suspend fun getGoals(): List<GoalEntity>

    @Insert
    suspend fun insertGoal(goal: GoalEntity): Long

    @Update
    suspend fun updateGoal(goal: GoalEntity)

    @Delete
    suspend fun deleteGoal(goal: GoalEntity)

    @Query("SELECT * FROM budgets")
    suspend fun getBudgets(): List<BudgetEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateBudget(budget: BudgetEntity): Long

    @Delete
    suspend fun deleteBudget(budget: BudgetEntity)

    @Query("SELECT * FROM debts")
    suspend fun getDebts(): List<DebtEntity>

    @Insert
    suspend fun insertDebt(debt: DebtEntity): Long

    @Update
    suspend fun updateDebt(debt: DebtEntity)

    @Delete
    suspend fun deleteDebt(debt: DebtEntity)

    @Query("SELECT * FROM debt_payments WHERE debtId = :debtId ORDER BY date ASC")
    suspend fun getDebtPayments(debtId: Long): List<DebtPaymentEntity>

    @Insert
    suspend fun insertDebtPayment(payment: DebtPaymentEntity): Long

    @Query("DELETE FROM debt_payments WHERE debtId = :debtId")
    suspend fun deleteDebtPaymentsForDebt(debtId: Long)

    @Query("SELECT * FROM settings WHERE `key` = :key LIMIT 1")
    suspend fun getSetting(key: String): SettingEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun setSetting(setting: SettingEntity)

    @Transaction
    suspend fun deleteDebtWithPayments(debt: DebtEntity) {
        deleteDebtPaymentsForDebt(debt.id)
        deleteDebt(debt)
    }

    @Query("DELETE FROM transactions")
    suspend fun clearTransactions()

    @Query("DELETE FROM categories")
    suspend fun clearCategories()

    @Query("DELETE FROM accounts")
    suspend fun clearAccounts()

    @Query("DELETE FROM goals")
    suspend fun clearGoals()

    @Query("DELETE FROM budgets")
    suspend fun clearBudgets()

    @Query("DELETE FROM debts")
    suspend fun clearDebts()

    @Query("DELETE FROM debt_payments")
    suspend fun clearDebtPayments()

    @Query("DELETE FROM settings")
    suspend fun clearSettings()
}

@Database(
    entities = [
        TransactionEntity::class,
        CategoryEntity::class,
        AccountEntity::class,
        GoalEntity::class,
        BudgetEntity::class,
        DebtEntity::class,
        DebtPaymentEntity::class,
        SettingEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun financeDao(): FinanceDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "ojirku_database"
                )
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
