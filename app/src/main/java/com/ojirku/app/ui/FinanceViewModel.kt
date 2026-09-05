package com.ojirku.app.ui

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.google.gson.Gson
import com.google.gson.JsonObject
import com.ojirku.app.BuildConfig
import com.ojirku.app.data.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.TimeUnit

class FinanceViewModel(application: Application) : AndroidViewModel(application) {
    private val db = AppDatabase.getDatabase(application)
    private val dao = db.financeDao()
    private val gson = Gson()
    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    // Screen navigation layout
    var activeScreen by mutableStateOf("welcome") // "welcome", "dashboard", "transactions", "budgets", "goals", "debts", "reports", "settings"
    var isAuthenticated by mutableStateOf(false)
    var isPinSet by mutableStateOf(false)
    var savedPin by mutableStateOf("")

    // Data lists
    var transactions by mutableStateOf<List<TransactionEntity>>(emptyList())
    var categories by mutableStateOf<List<CategoryEntity>>(emptyList())
    var accounts by mutableStateOf<List<AccountEntity>>(emptyList())
    var goals by mutableStateOf<List<GoalEntity>>(emptyList())
    var budgets by mutableStateOf<List<BudgetEntity>>(emptyList())
    var debts by mutableStateOf<List<DebtEntity>>(emptyList())

    // Settings
    var appLanguage by mutableStateOf("id") // "id" or "en"

    // AI suggestion response
    var aiReport by mutableStateOf("")
    var isGeneratingAiReport by mutableStateOf(false)

    init {
        loadSettingsAndData()
    }

    private fun loadSettingsAndData() {
        viewModelScope.launch {
            // Load language preference
            val langSet = dao.getSetting("language")
            appLanguage = langSet?.value ?: "id"

            // Check if PIN code is set
            val pinSet = dao.getSetting("pin")
            if (pinSet != null && pinSet.value.isNotBlank()) {
                isPinSet = true
                savedPin = pinSet.value
                activeScreen = "pin_lock"
            } else {
                isPinSet = false
                activeScreen = "welcome"
            }

            // Refresh essential lists
            refreshAllData()
        }
    }

    suspend fun refreshAllData() {
        transactions = dao.getTransactions()
        categories = dao.getCategories()
        accounts = dao.getAccounts()
        goals = dao.getGoals()
        budgets = dao.getBudgets()
        debts = dao.getDebts()

        // Populate with defaults if databases are empty
        if (categories.isEmpty()) {
            populateDefaultCategoriesAndAccounts()
        }
    }

    private suspend fun populateDefaultCategoriesAndAccounts() {
        val expenses = if (appLanguage == "en") {
            listOf("Food & Drink", "Transport", "Housing", "Shopping", "Entertainment", "Bills & Utilities", "Health", "Debt Payment", "Other")
        } else {
            listOf("Makanan & Minuman", "Transportasi", "Tempat Tinggal", "Belanja", "Hiburan", "Tagihan & Utilitas", "Kesehatan", "Pembayaran Hutang", "Lainnya")
        }

        val incomes = if (appLanguage == "en") {
            listOf("Salary", "Bonus", "Investment", "Gift", "Other")
        } else {
            listOf("Gaji", "Bonus", "Investasi", "Hadiah", "Lainnya")
        }

        val categoriesToInsert = mutableListOf<CategoryEntity>()
        expenses.forEach { categoriesToInsert.add(CategoryEntity(name = it, type = "EXPENSE")) }
        incomes.forEach { categoriesToInsert.add(CategoryEntity(name = it, type = "INCOME")) }

        dao.insertCategories(categoriesToInsert)
        categories = dao.getCategories()

        if (dao.getAccounts().isEmpty()) {
            val defaultAccounts = listOf(
                AccountEntity(name = if (appLanguage == "en") "Cash" else "Uang Tunai", type = "Cash", initialBalance = 0.0),
                AccountEntity(name = if (appLanguage == "en") "Main Bank Account" else "Rekening Utama", type = "Bank", initialBalance = 1000000.0)
            )
            dao.insertAccounts(defaultAccounts)
        }
        accounts = dao.getAccounts()
    }

    // PIN lock workflow
    fun setupPin(pin: String) {
        viewModelScope.launch {
            dao.setSetting(SettingEntity("pin", pin))
            savedPin = pin
            isPinSet = true
            isAuthenticated = true
            
            // Redirect to debts for new user logic
            val hasSeenDebts = dao.getSetting("has_seen_debts_module")
            if (hasSeenDebts == null) {
                dao.setSetting(SettingEntity("has_seen_debts_module", "true"))
                activeScreen = "debts"
            } else {
                activeScreen = "dashboard"
            }
        }
    }

    fun verifyPin(pin: String): Boolean {
        return if (pin == savedPin) {
            isAuthenticated = true
            activeScreen = "dashboard"
            true
        } else {
            false
        }
    }

    fun logout() {
        isAuthenticated = false
        activeScreen = if (isPinSet) "pin_lock" else "welcome"
    }

    // Change Language
    fun updateLanguage(lang: String) {
        viewModelScope.launch {
            dao.setSetting(SettingEntity("language", lang))
            appLanguage = lang
            // Re-populate system categories if only defaults are present or categories are empty
            refreshAllData()
        }
    }

    // Reset All Data
    fun resetAllData() {
        viewModelScope.launch {
            dao.clearTransactions()
            dao.clearCategories()
            dao.clearAccounts()
            dao.clearBudgets()
            dao.clearGoals()
            dao.clearDebts()
            dao.clearDebtPayments()
            dao.clearSettings()

            // Reset current state
            isPinSet = false
            savedPin = ""
            isAuthenticated = false
            activeScreen = "welcome"
            
            loadSettingsAndData()
        }
    }

    // --- Transactions CRUD ---
    fun addTransaction(type: String, amount: Double, categoryId: Long, accountId: Long, description: String, date: Long) {
        viewModelScope.launch {
            dao.insertTransaction(
                TransactionEntity(
                    type = type,
                    amount = amount,
                    categoryId = categoryId,
                    accountId = accountId,
                    description = description,
                    date = date
                )
            )
            refreshAllData()
        }
    }

    fun updateTransaction(tx: TransactionEntity) {
        viewModelScope.launch {
            dao.updateTransaction(tx)
            refreshAllData()
        }
    }

    fun deleteTransaction(tx: TransactionEntity) {
        viewModelScope.launch {
            dao.deleteTransaction(tx)
            refreshAllData()
        }
    }

    // --- Categories CRUD ---
    fun addCategory(name: String, type: String) {
        viewModelScope.launch {
            dao.insertCategory(CategoryEntity(name = name, type = type))
            refreshAllData()
        }
    }

    // --- Accounts CRUD ---
    fun addAccount(name: String, type: String, initialBalance: Double) {
        viewModelScope.launch {
            dao.insertAccount(AccountEntity(name = name, type = type, initialBalance = initialBalance))
            refreshAllData()
        }
    }

    fun calculateAccountBalance(accountId: Long): Double {
        val account = accounts.find { it.id == accountId } ?: return 0.0
        val accountTransactions = transactions.filter { it.accountId == accountId }
        var balance = account.initialBalance
        accountTransactions.forEach { tx ->
            if (tx.type == "INCOME") {
                balance += tx.amount
            } else {
                balance -= tx.amount
            }
        }
        return balance
    }

    // --- Goals CRUD ---
    fun addGoal(name: String, targetAmount: Double, currentAmount: Double, deadline: Long? = null) {
        viewModelScope.launch {
            dao.insertGoal(GoalEntity(name = name, targetAmount = targetAmount, currentAmount = currentAmount, deadline = deadline))
            refreshAllData()
        }
    }

    fun updateGoal(goal: GoalEntity) {
        viewModelScope.launch {
            dao.updateGoal(goal)
            refreshAllData()
        }
    }

    fun deleteGoal(goal: GoalEntity) {
        viewModelScope.launch {
            dao.deleteGoal(goal)
            refreshAllData()
        }
    }

    // --- Budgets CRUD ---
    fun addOrUpdateBudget(categoryId: Long, amount: Double, period: String) {
        viewModelScope.launch {
            val existing = budgets.find { it.categoryId == categoryId }
            if (existing != null) {
                dao.insertOrUpdateBudget(existing.copy(amount = amount, period = period))
            } else {
                dao.insertOrUpdateBudget(BudgetEntity(categoryId = categoryId, amount = amount, period = period))
            }
            refreshAllData()
        }
    }

    fun deleteBudget(budget: BudgetEntity) {
        viewModelScope.launch {
            dao.deleteBudget(budget)
            refreshAllData()
        }
    }

    fun calculateBudgetUsage(categoryId: Long): Double {
        val startOfMonth = Calendar.getInstance().apply {
            set(Calendar.DAY_OF_MONTH, 1)
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }.timeInMillis

        return transactions
            .filter { it.categoryId == categoryId && it.type == "EXPENSE" && it.date >= startOfMonth }
            .sumOf { it.amount }
    }

    // --- Debts CRUD ---
    fun addDebt(name: String, lender: String, totalAmount: Double, dueDate: Long? = null) {
        viewModelScope.launch {
            dao.insertDebt(DebtEntity(name = name, lender = lender, totalAmount = totalAmount, amountPaid = 0.0, dueDate = dueDate))
            refreshAllData()
        }
    }

    fun deleteDebt(debt: DebtEntity) {
        viewModelScope.launch {
            dao.deleteDebtWithPayments(debt)
            refreshAllData()
        }
    }

    fun payDebt(debt: DebtEntity, amount: Double, accountId: Long, date: Long) {
        viewModelScope.launch {
            // 1. Add payment record
            dao.insertDebtPayment(DebtPaymentEntity(debtId = debt.id, accountId = accountId, amount = amount, date = date))

            // 2. Update Debt
            val updatedDebt = debt.copy(amountPaid = debt.amountPaid + amount)
            dao.updateDebt(updatedDebt)

            // 3. Find/Add Category for Debt Payment and add corresponding Expense
            var debtCategory = categories.find { it.name == "Pembayaran Hutang" || it.name == "Debt Payment" }
            if (debtCategory == null) {
                val catId = dao.insertCategory(CategoryEntity(
                    name = if (appLanguage == "en") "Debt Payment" else "Pembayaran Hutang",
                    type = "EXPENSE"
                ))
                debtCategory = CategoryEntity(id = catId, name = if (appLanguage == "en") "Debt Payment" else "Pembayaran Hutang", type = "EXPENSE")
            }

            dao.insertTransaction(
                TransactionEntity(
                    type = "EXPENSE",
                    amount = amount,
                    categoryId = debtCategory.id,
                    accountId = accountId,
                    date = date,
                    description = if (appLanguage == "en") "Payment for ${debt.name}" else "Pembayaran untuk ${debt.name}"
                )
            )

            refreshAllData()
        }
    }

    fun getDebtPayments(debtId: Long, onResult: (List<DebtPaymentEntity>) -> Unit) {
        viewModelScope.launch {
            val payments = dao.getDebtPayments(debtId)
            onResult(payments)
        }
    }

    // --- AI Suggestions Integration ---
    fun generateAiReport() {
        if (isGeneratingAiReport) return
        isGeneratingAiReport = true
        aiReport = ""

        viewModelScope.launch(Dispatchers.Default) {
            val apiKey = BuildConfig.GEMINI_API_KEY
            if (apiKey.isBlank() || apiKey == "PLACEHOLDER_API_KEY") {
                withContext(Dispatchers.Main) {
                    aiReport = if (appLanguage == "en") {
                        "Error: Gemini API key is placeholder or empty. Please supply a valid key via settings or env variable."
                    } else {
                        "Eror: Kunci API Gemini kosong atau bawaan. Harap lengkapi kunci API yang valid di pengaturan atau variabel lingkungan."
                    }
                    isGeneratingAiReport = false
                }
                return@launch
            }

            // Construct text summary of financial metrics
            val goalsSummary = if (goals.isNotEmpty()) {
                goals.joinToString("\n") { g ->
                    "- ${g.name}: Target Rp${formatRupiah(g.targetAmount)}, Terkumpul Rp${formatRupiah(g.currentAmount)}"
                }
            } else {
                if (appLanguage == "en") "No goals set." else "Belum ada tujuan keuangan."
            }

            val budgetsSummary = if (budgets.isNotEmpty()) {
                budgets.joinToString("\n") { b ->
                    val catName = categories.find { it.id == b.categoryId }?.name ?: "Kategori Lain"
                    "- $catName: Batas Rp${formatRupiah(b.amount)}, Terpakai Rp${formatRupiah(calculateBudgetUsage(b.categoryId))}"
                }
            } else {
                if (appLanguage == "en") "No budgets set." else "Belum menetapkan anggaran."
            }

            val sdf = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
            val recentTx = transactions.take(15)
            val transactionsSummary = if (recentTx.isNotEmpty()) {
                recentTx.joinToString("\n") { t ->
                    val catName = categories.find { it.id == t.categoryId }?.name ?: "Lainnya"
                    val typeText = if (t.type == "INCOME") "Pemasukan" else "Pengeluaran"
                    "- $typeText: Rp${formatRupiah(t.amount)} ($catName) pada ${sdf.format(Date(t.date))}. Ket: ${t.description}"
                }
            } else {
                if (appLanguage == "en") "No recent transactions." else "Belum ada transaksi terakhir."
            }

            val systemInstruction = "You are 'OJIRKU AI', a helpful and friendly financial assistant for a personal budgeting app. Your tone should be encouraging, clear, and easy to understand for someone who is not a financial expert. Provide insights in concise bullet points or short paragraphs. Start with a warm greeting. Analyze the provided data and give actionable advice. If data is sparse, give general financial tips. Your response MUST be formatted as Markdown."

            val prompt = """
                Here is my financial data. Please act as a friendly financial advisor.
                Analyze my spending habits and provide personalized, actionable suggestions for saving money and reaching my goals.
                Identify any potential anomalous spending. Be encouraging and provide concrete examples.
                Respond in the user's language (assume Indonesian unless the text heavily suggests English).

                Financial Goals:
                $goalsSummary

                Monthly Budgets:
                $budgetsSummary

                Recent Transactions:
                $transactionsSummary
            """.trimIndent()

            try {
                // Construct the JSON payload for standard model generateContent endpoint
                val requestMap = mapOf(
                    "contents" to listOf(
                        mapOf(
                            "parts" to listOf(
                                mapOf("text" to prompt)
                            )
                        )
                    ),
                    "systemInstruction" to mapOf(
                        "parts" to listOf(
                            mapOf("text" to systemInstruction)
                        )
                    ),
                    "generationConfig" to mapOf(
                        "temperature" to 0.5
                    )
                )

                val jsonPayload = gson.toJson(requestMap)
                val requestBody = jsonPayload.toRequestBody("application/json; charset=utf-8".toMediaType())

                val request = Request.Builder()
                    .url("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$apiKey")
                    .post(requestBody)
                    .build()

                val response = client.newCall(request).execute()
                val responseBody = response.body?.string()

                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && responseBody != null) {
                        try {
                            val jsonResponse = gson.fromJson(responseBody, JsonObject::class.java)
                            val candidates = jsonResponse.getAsJsonArray("candidates")
                            val content = candidates.get(0).asJsonObject.getAsJsonObject("content")
                            val parts = content.getAsJsonArray("parts")
                            val responseText = parts.get(0).asJsonObject.get("text").asString
                            aiReport = responseText
                        } catch (e: Exception) {
                            aiReport = if (appLanguage == "en") {
                                "Failed to parse AI response. Raw output: \n$responseBody"
                            } else {
                                "Gagal membaca tanggapan AI. Output mentah: \n$responseBody"
                            }
                        }
                    } else {
                        aiReport = if (appLanguage == "en") {
                            "API Call failed with code ${response.code}: $responseBody"
                        } else {
                            "Gagal memanggil API dengan kode ${response.code}: $responseBody"
                        }
                    }
                    isGeneratingAiReport = false
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    aiReport = if (appLanguage == "en") {
                        "Connection error: ${e.localizedMessage}. Please verify your device's internet connection."
                    } else {
                        "Kesalahan koneksi: ${e.localizedMessage}. Hubungkan perangkat Anda ke internet."
                    }
                    isGeneratingAiReport = false
                }
            }
        }
    }

    private fun formatRupiah(value: Double): String {
        val format = NumberFormat.getIntegerInstance(Locale("id", "ID"))
        return format.format(value.toLong())
    }
}
