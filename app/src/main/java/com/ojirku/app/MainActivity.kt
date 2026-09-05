package com.ojirku.app

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.lifecycle.viewmodel.compose.viewModel
import com.ojirku.app.data.*
import com.ojirku.app.ui.FinanceViewModel
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            OjirkuTheme {
                val viewModel: FinanceViewModel = viewModel()
                OjirkuApp(viewModel)
            }
        }
    }
}

// Design Constants aligning to the Web App UI palette
val DarkBgStart = Color(0xFF38345E)
val DarkBgEnd = Color(0xFF1D172E)
val AccentOrange = Color(0xFFF97316)
val AccentYellow = Color(0xFFFACC15)
val AccentTeal = Color(0xFF14B8A6)
val SurfaceColor = Color(0x33FFFFFF) // Translucent theme card styling
val CardBg = Color(0xFF241D3B)
val TextGray = Color(0xFF9E99B3)

@Composable
fun OjirkuTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = darkColorScheme(
            primary = AccentTeal,
            onPrimary = Color.Black,
            secondary = AccentYellow,
            tertiary = AccentOrange,
            background = DarkBgEnd,
            surface = CardBg,
            onBackground = Color.White,
            onSurface = Color.White
        ),
        content = content
    )
}

// String resources translating statically inside the Applet
object OjirkuStrings {
    private val en = mapOf(
        "welcome" to "Welcome to OJIRKU",
        "welcome_desc" to "Your Offline-First AI-Powered Personal Finance Companion",
        "pin_required" to "Enter Your Security PIN",
        "pin_desc" to "Secure your financial records offline",
        "pin_mismatch" to "PIN is incorrect! Please try again.",
        "pin_setup" to "Set New Security PIN",
        "pin_setup_desc" to "Set a 4-digit PIN to lock your personal financial records.",
        "pin_length_err" to "PIN must be exactly 4 digits!",
        "submit" to "Submit",
        "create_pin" to "Setup PIN",
        "register" to "Register",
        "total_balance" to "Total Balance",
        "net_worth" to "Net Worth",
        "income" to "Income",
        "expense" to "Expense",
        "dashboard" to "Dashboard",
        "transactions" to "Transactions",
        "budgets" to "Budgets",
        "goals" to "Goals",
        "debts" to "Debts & Loans",
        "reports" to "AI Scout",
        "settings" to "Settings",
        "remaining" to "Remaining",
        "limit" to "Monthly Limit",
        "target" to "Goal Target",
        "saved" to "Saved Amount",
        "lender" to "Lender",
        "due_date" to "Due Date",
        "payments" to "Payment Logs",
        "add_transaction" to "Add Transaction",
        "add_budget" to "Set Category Budget",
        "add_goal" to "Create Saving Goal",
        "add_debt" to "Log Loan Record",
        "add_account" to "New Wallet/Account",
        "recent_tx" to "Recent Activity",
        "ai_report_intro" to "Strategic Financial Forecasts",
        "generate_ai_report" to "Generate AI Report",
        "generating" to "Consulting Ojirku AI...",
        "language" to "Application Language",
        "reset_data" to "Purge Local Storage",
        "amount" to "Amount",
        "category" to "Category",
        "account" to "Account / Wallet",
        "description" to "Description",
        "save" to "Save",
        "cancel" to "Cancel",
        "category_manager" to "Register Categories",
        "account_manager" to "Wallet & Bank Accounts",
        "empty_transactions" to "No recorded transactions. Tap + below to log one!",
        "empty_budgets" to "No monthly category limits set yet.",
        "empty_goals" to "No saving targets specified.",
        "empty_debts" to "Your loan notebook is currently clean.",
        "delete_confirm" to "Are you sure you want to delete this?",
        "log_payment" to "Record Payment",
        "amount_paid" to "Paid Amount"
    )

    private val id = mapOf(
        "welcome" to "Selamat Datang di OJIRKU",
        "welcome_desc" to "Asisten Keuangan Offline-First Anda dengan Kecerdasan Buatan AI",
        "pin_required" to "Masukkan PIN Keamanan",
        "pin_desc" to "Amankan catatan keuangan Anda secara offline",
        "pin_mismatch" to "PIN salah! Silakan coba lagi.",
        "pin_setup" to "Atur PIN Keamanan Baru",
        "pin_setup_desc" to "Atur 4 angka PIN untuk mengunci catatan keuangan pribadi Anda.",
        "pin_length_err" to "PIN harus terdiri dari 4 digit angka!",
        "submit" to "Kirim",
        "create_pin" to "Atur PIN",
        "register" to "Daftar",
        "total_balance" to "Total Saldo Anda",
        "net_worth" to "Kekayaan Bersih",
        "income" to "Pemasukan",
        "expense" to "Pengeluaran",
        "dashboard" to "Dasbor",
        "transactions" to "Transaksi",
        "budgets" to "Anggaran",
        "goals" to "Tujuan",
        "debts" to "Utang-Piutang",
        "reports" to "Scout AI",
        "settings" to "Pengaturan",
        "remaining" to "Tersisa",
        "limit" to "Batas Bulanan",
        "target" to "Target Tabungan",
        "saved" to "Jumlah Terkumpul",
        "lender" to "Lender/Pemberi Utang",
        "due_date" to "Jatuh Tempo",
        "payments" to "Log Pembayaran",
        "add_transaction" to "Catat Transaksi",
        "add_budget" to "Atur Anggaran Kategori",
        "add_goal" to "Atur Tujuan Tabungan",
        "add_debt" to "Catat Riwayat Utang",
        "add_account" to "Tambah Rekening Baru",
        "recent_tx" to "Aktivitas Terakhir",
        "ai_report_intro" to "Analisis Finansial Strategis",
        "generate_ai_report" to "Buat Laporan AI",
        "generating" to "Menghubungi Ojirku AI...",
        "language" to "Bahasa Aplikasi",
        "reset_data" to "Hapus Seluruh Data",
        "amount" to "Jumlah (Rp)",
        "category" to "Kategori",
        "account" to "Metode / Rekening",
        "description" to "Keterangan",
        "save" to "Simpan",
        "cancel" to "Batal",
        "category_manager" to "Kelola Kategori",
        "account_manager" to "Pengelola Rekening & Wallet",
        "empty_transactions" to "Belum ada transaksi. Tekan tombol + di bawah untuk mencatat!",
        "empty_budgets" to "Belum ada anggaran kategori bulanan.",
        "empty_goals" to "Belum ada target tabungan yang diatur.",
        "empty_debts" to "Catatan utang komitmen Anda saat ini bersih.",
        "delete_confirm" to "Apakah Anda yakin ingin menghapus ini?",
        "log_payment" to "Catat Pembayaran",
        "amount_paid" to "Sudah Dibayar"
    )

    fun get(key: String, lang: String): String {
        return (if (lang == "en") en else id)[key] ?: key
    }
}

fun formatRupiah(amount: Double): String {
    val format = NumberFormat.getIntegerInstance(Locale("id", "ID"))
    return "Rp ${format.format(amount.toLong())}"
}

@Composable
fun OjirkuApp(viewModel: FinanceViewModel) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(DarkBgStart, DarkBgEnd)
                )
            )
    ) {
        when (viewModel.activeScreen) {
            "welcome" -> WelcomeScreen(viewModel)
            "pin_lock" -> PinLockScreen(viewModel)
            else -> {
                // Layout standard with navigation rail/bar
                Scaffold(
                    containerColor = Color.Transparent,
                    bottomBar = {
                        OjirkuBottomBar(
                            activeScreen = viewModel.activeScreen,
                            lang = viewModel.appLanguage,
                            onNavChange = { viewModel.activeScreen = it }
                        )
                    }
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        when (viewModel.activeScreen) {
                            "dashboard" -> DashboardScreen(viewModel)
                            "transactions" -> TransactionsScreen(viewModel)
                            "budgets" -> BudgetsScreen(viewModel)
                            "goals" -> GoalsScreen(viewModel)
                            "debts" -> DebtsScreen(viewModel)
                            "reports" -> ReportsScreen(viewModel)
                            "settings" -> SettingsScreen(viewModel)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun OjirkuBottomBar(activeScreen: String, lang: String, onNavChange: (String) -> Unit) {
    val items = listOf(
        Triple("dashboard", Icons.Rounded.Home, OjirkuStrings.get("dashboard", lang)),
        Triple("transactions", Icons.Rounded.ReceiptLong, OjirkuStrings.get("transactions", lang)),
        Triple("budgets", Icons.Rounded.PieChart, OjirkuStrings.get("budgets", lang)),
        Triple("goals", Icons.Rounded.Star, OjirkuStrings.get("goals", lang)),
        Triple("debts", Icons.Rounded.Payments, OjirkuStrings.get("debts", lang)),
        Triple("reports", Icons.Rounded.AutoAwesome, OjirkuStrings.get("reports", lang)),
        Triple("settings", Icons.Rounded.Settings, OjirkuStrings.get("settings", lang))
    )

    NavigationBar(
        containerColor = DarkBgEnd.copy(alpha = 0.95f),
        tonalElevation = 8.dp,
        modifier = Modifier.height(72.dp)
    ) {
        items.forEach { (route, icon, label) ->
            val isSelected = activeScreen == route
            NavigationBarItem(
                selected = isSelected,
                onClick = { onNavChange(route) },
                icon = {
                    Icon(
                        imageVector = icon,
                        contentDescription = label,
                        tint = if (isSelected) AccentTeal else TextGray
                    )
                },
                label = {
                    Text(
                        text = label,
                        fontSize = 9.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        color = if (isSelected) AccentTeal else TextGray
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    indicatorColor = Color(0x1F14B8A6)
                )
            )
        }
    }
}

// --- SCREEN Welcome ---
@Composable
fun WelcomeScreen(viewModel: FinanceViewModel) {
    var pinInput by remember { mutableStateOf("") }
    val context = LocalContext.current
    val lang = viewModel.appLanguage

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Rounded.AutoAwesome,
            contentDescription = "Ojirku Logo",
            tint = AccentYellow,
            modifier = Modifier.size(80.dp)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = OjirkuStrings.get("welcome", lang).uppercase(),
            fontSize = 28.sp,
            fontWeight = FontWeight.ExtraBold,
            color = Color.White,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = OjirkuStrings.get("welcome_desc", lang),
            fontSize = 14.sp,
            color = TextGray,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = 16.dp)
        )

        Spacer(modifier = Modifier.height(48.dp))

        // Card containing setup trigger
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = CardBg),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = OjirkuStrings.get("pin_setup", lang),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = OjirkuStrings.get("pin_setup_desc", lang),
                    fontSize = 12.sp,
                    color = TextGray,
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(20.dp))

                OutlinedTextField(
                    value = pinInput,
                    onValueChange = { if (it.length <= 4 && it.all { c -> c.isDigit() }) pinInput = it },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
                    visualTransformation = PasswordVisualTransformation(),
                    singleLine = true,
                    label = { Text("PIN") },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = AccentTeal,
                        unfocusedBorderColor = TextGray,
                        focusedLabelColor = AccentTeal
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(20.dp))

                Button(
                    onClick = {
                        if (pinInput.length == 4) {
                            viewModel.setupPin(pinInput)
                        } else {
                            Toast.makeText(context, OjirkuStrings.get("pin_length_err", lang), Toast.LENGTH_SHORT).show()
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = AccentTeal),
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        text = OjirkuStrings.get("submit", lang).uppercase(),
                        fontWeight = FontWeight.Bold,
                        color = Color.Black
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(40.dp))
        // Quick flags selector
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Language: ",
                fontSize = 12.sp,
                color = TextGray
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "ID",
                fontSize = 12.sp,
                fontWeight = if (lang == "id") FontWeight.Bold else FontWeight.Normal,
                color = if (lang == "id") AccentTeal else TextGray,
                modifier = Modifier
                    .clickable { viewModel.updateLanguage("id") }
                    .padding(8.dp)
            )
            Text(text = " | ", color = TextGray)
            Text(
                text = "EN",
                fontSize = 12.sp,
                fontWeight = if (lang == "en") FontWeight.Bold else FontWeight.Normal,
                color = if (lang == "en") AccentTeal else TextGray,
                modifier = Modifier
                    .clickable { viewModel.updateLanguage("en") }
                    .padding(8.dp)
            )
        }
    }
}

// --- SCREEN Pin Lock ---
@Composable
fun PinLockScreen(viewModel: FinanceViewModel) {
    var pinValue by remember { mutableStateOf("") }
    val context = LocalContext.current
    val lang = viewModel.appLanguage

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Rounded.Lock,
            contentDescription = "Pin Lock Shield",
            tint = AccentOrange,
            modifier = Modifier.size(72.dp)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = OjirkuStrings.get("pin_required", lang),
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = OjirkuStrings.get("pin_desc", lang),
            fontSize = 13.sp,
            color = TextGray
        )

        Spacer(modifier = Modifier.height(40.dp))

        Card(
            modifier = Modifier.fillMaxWidth(0.85f),
            colors = CardDefaults.cardColors(containerColor = CardBg),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                OutlinedTextField(
                    value = pinValue,
                    onValueChange = { if (it.length <= 4 && it.all { c -> c.isDigit() }) pinValue = it },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
                    visualTransformation = PasswordVisualTransformation(),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = AccentOrange,
                        unfocusedBorderColor = TextGray
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(24.dp))

                Button(
                    onClick = {
                        val correct = viewModel.verifyPin(pinValue)
                        if (!correct) {
                            pinValue = ""
                            Toast.makeText(context, OjirkuStrings.get("pin_mismatch", lang), Toast.LENGTH_SHORT).show()
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = AccentOrange),
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        text = OjirkuStrings.get("submit", lang).uppercase(),
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }
        }
    }
}

// --- SCREEN Dashboard ---
@Composable
fun DashboardScreen(viewModel: FinanceViewModel) {
    val lang = viewModel.appLanguage
    var showAddAccountDialog by remember { mutableStateOf(false) }

    val totalIncome = viewModel.transactions.filter { it.type == "INCOME" }.sumOf { it.amount }
    val totalExpense = viewModel.transactions.filter { it.type == "EXPENSE" }.sumOf { it.amount }
    val initialWalletsBalance = viewModel.accounts.sumOf { it.initialBalance }
    val netBalance = initialWalletsBalance + totalIncome - totalExpense

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        // Applet Banner Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "OJIRKU",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "Personal Budget Scout",
                    fontSize = 11.sp,
                    color = TextGray
                )
            }
            Icon(
                imageVector = Icons.Rounded.AccountBalanceWallet,
                contentDescription = "Wallet Icon",
                tint = AccentTeal,
                modifier = Modifier
                    .size(32.dp)
                    .clickable { showAddAccountDialog = true }
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Net Worth Card with Sunset Brush background
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.Transparent)
        ) {
            Box(
                modifier = Modifier
                    .background(
                        brush = Brush.horizontalGradient(
                            colors = listOf(Color(0xFF8A2387), Color(0xFFE94057), Color(0xFFF27121))
                        )
                    )
                    .fillMaxWidth()
                    .padding(24.dp)
            ) {
                Column {
                    Text(
                        text = OjirkuStrings.get("total_balance", lang).uppercase(),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White.copy(alpha = 0.8f)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = formatRupiah(netBalance),
                        fontSize = 28.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color.White
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Income & Expense Breakdown Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Card(
                modifier = Modifier.weight(1f),
                colors = CardDefaults.cardColors(containerColor = CardBg),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(12.dp)
                                .background(AccentTeal, RoundedCornerShape(2.dp))
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = OjirkuStrings.get("income", lang),
                            fontSize = 11.sp,
                            color = TextGray
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = formatRupiah(totalIncome),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }

            Card(
                modifier = Modifier.weight(1f),
                colors = CardDefaults.cardColors(containerColor = CardBg),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(12.dp)
                                .background(AccentOrange, RoundedCornerShape(2.dp))
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = OjirkuStrings.get("expense", lang),
                            fontSize = 11.sp,
                            color = TextGray
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = formatRupiah(totalExpense),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Account Manager (Wallet & Banks) Subsection
        Text(
            text = OjirkuStrings.get("account_manager", lang).uppercase(),
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = AccentYellow,
            letterSpacing = 1.sp
        )
        Spacer(modifier = Modifier.height(8.dp))
        viewModel.accounts.forEach { acc ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                colors = CardDefaults.cardColors(containerColor = CardBg.copy(alpha = 0.5f)),
                shape = RoundedCornerShape(8.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = if (acc.type == "Bank") Icons.Rounded.AccountBalance else Icons.Rounded.Wallet,
                            contentDescription = acc.type,
                            tint = AccentTeal,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(text = acc.name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text(text = acc.type, color = TextGray, fontSize = 11.sp)
                        }
                    }
                    Text(
                        text = formatRupiah(viewModel.calculateAccountBalance(acc.id)),
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = Color.White
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Recent Transactions Section
        Text(
            text = OjirkuStrings.get("recent_tx", lang).uppercase(),
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = AccentTeal,
            letterSpacing = 1.sp
        )
        Spacer(modifier = Modifier.height(8.dp))
        if (viewModel.transactions.isEmpty()) {
            Text(
                text = OjirkuStrings.get("empty_transactions", lang),
                fontSize = 12.sp,
                color = TextGray,
                modifier = Modifier.padding(vertical = 8.dp)
            )
        } else {
            val sFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
            viewModel.transactions.take(5).forEach { tx ->
                val categoryName = viewModel.categories.find { it.id == tx.categoryId }?.name ?: "Lainnya"
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    colors = CardDefaults.cardColors(containerColor = CardBg),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(text = tx.description.ifEmpty { categoryName }, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text(
                                text = "$categoryName • ${sFormat.format(Date(tx.date))}",
                                color = TextGray,
                                fontSize = 11.sp
                            )
                        }
                        Text(
                            text = (if (tx.type == "INCOME") "+" else "-") + formatRupiah(tx.amount),
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            color = if (tx.type == "INCOME") AccentTeal else AccentOrange
                        )
                    }
                }
            }
        }
    }

    // Modal Dialog to add a new account
    if (showAddAccountDialog) {
        var accName by remember { mutableStateOf("") }
        var accType by remember { mutableStateOf("Cash") }
        var accInitial by remember { mutableStateOf("") }

        Dialog(onDismissRequest = { showAddAccountDialog = false }) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = CardBg),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Text(
                        text = OjirkuStrings.get("add_account", lang),
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )

                    OutlinedTextField(
                        value = accName,
                        onValueChange = { accName = it },
                        singleLine = true,
                        label = { Text("Account Name") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    // Dummy Radio Row Selector
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf("Cash", "Bank", "E-Wallet").forEach { type ->
                            ElevatedButton(
                                onClick = { accType = type },
                                colors = ButtonDefaults.elevatedButtonColors(
                                    containerColor = if (accType == type) AccentTeal else DarkBgEnd,
                                    contentColor = if (accType == type) Color.Black else Color.White
                                ),
                                modifier = Modifier.weight(1f)
                            ) {
                                Text(type, fontSize = 10.sp)
                            }
                        }
                    }

                    OutlinedTextField(
                        value = accInitial,
                        onValueChange = { if (it.all { c -> c.isDigit() }) accInitial = it },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        label = { Text("Initial Balance") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        TextButton(
                            onClick = { showAddAccountDialog = false },
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(OjirkuStrings.get("cancel", lang), color = TextGray)
                        }

                        Button(
                            onClick = {
                                if (accName.isNotBlank() && accInitial.isNotBlank()) {
                                    viewModel.addAccount(accName, accType, accInitial.toDouble())
                                    showAddAccountDialog = false
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = AccentTeal),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(OjirkuStrings.get("save", lang), color = Color.Black)
                        }
                    }
                }
            }
        }
    }
}

// --- SCREEN Transactions ---
@Composable
fun TransactionsScreen(viewModel: FinanceViewModel) {
    val lang = viewModel.appLanguage
    var showAddTxDialog by remember { mutableStateOf(false) }

    Box(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            Text(
                text = OjirkuStrings.get("transactions", lang).uppercase(),
                fontSize = 20.sp,
                fontWeight = FontWeight.ExtraBold,
                color = Color.White
            )
            Spacer(modifier = Modifier.height(16.dp))

            if (viewModel.transactions.isEmpty()) {
                Box(
                    modifier = Modifier.weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = OjirkuStrings.get("empty_transactions", lang),
                        fontSize = 14.sp,
                        color = TextGray,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            } else {
                val sFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(viewModel.transactions) { tx ->
                        val cat = viewModel.categories.find { it.id == tx.categoryId }?.name ?: "Lainnya"
                        val acc = viewModel.accounts.find { it.id == tx.accountId }?.name ?: "Dompet"

                        Card(
                            colors = CardDefaults.cardColors(containerColor = CardBg),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = tx.description.ifEmpty { cat },
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 15.sp,
                                        color = Color.White
                                    )
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = "$cat • $acc • ${sFormat.format(Date(tx.date))}",
                                        fontSize = 11.sp,
                                        color = TextGray
                                    )
                                }
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = (if (tx.type == "INCOME") "+" else "-") + formatRupiah(tx.amount),
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 15.sp,
                                        color = if (tx.type == "INCOME") AccentTeal else AccentOrange
                                    )
                                    IconButton(onClick = { viewModel.deleteTransaction(tx) }) {
                                        Icon(
                                            imageVector = Icons.Rounded.Delete,
                                            contentDescription = "Delete",
                                            tint = AccentOrange.copy(alpha = 0.8f),
                                            modifier = Modifier.size(18.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // FAB to open dialog
        FloatingActionButton(
            onClick = { showAddTxDialog = true },
            containerColor = AccentTeal,
            contentColor = Color.Black,
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(24.dp)
        ) {
            Icon(Icons.Rounded.Add, contentDescription = "Add Transaction")
        }
    }

    if (showAddTxDialog) {
        var type by remember { mutableStateOf("EXPENSE") }
        var amountText by remember { mutableStateOf("") }
        var categoryId by remember { mutableStateOf<Long?>(null) }
        var accountId by remember { mutableStateOf<Long?>(null) }
        var description by remember { mutableStateOf("") }

        val filteredCategories = viewModel.categories.filter { it.type == type }
        if (categoryId == null && filteredCategories.isNotEmpty()) {
            categoryId = filteredCategories.first().id
        }
        if (accountId == null && viewModel.accounts.isNotEmpty()) {
            accountId = viewModel.accounts.first().id
        }

        Dialog(onDismissRequest = { showAddTxDialog = false }) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = CardBg),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp)
            ) {
                Column(
                    modifier = Modifier
                        .padding(20.dp)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = OjirkuStrings.get("add_transaction", lang),
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )

                    // INCOME / EXPENSE Toggle
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Button(
                            onClick = {
                                type = "EXPENSE"
                                categoryId = viewModel.categories.firstOrNull { it.type == "EXPENSE" }?.id
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = if (type == "EXPENSE") AccentOrange else DarkBgEnd),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(OjirkuStrings.get("expense", lang), fontSize = 11.sp, color = Color.White)
                        }

                        Button(
                            onClick = {
                                type = "INCOME"
                                categoryId = viewModel.categories.firstOrNull { it.type == "INCOME" }?.id
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = if (type == "INCOME") AccentTeal else DarkBgEnd),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(OjirkuStrings.get("income", lang), fontSize = 11.sp, color = if (type == "INCOME") Color.Black else Color.White)
                        }
                    }

                    OutlinedTextField(
                        value = amountText,
                        onValueChange = { if (it.all { c -> c.isDigit() }) amountText = it },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        label = { Text(OjirkuStrings.get("amount", lang)) },
                        modifier = Modifier.fillMaxWidth()
                    )

                    // Category Selector
                    Text(OjirkuStrings.get("category", lang), color = TextGray, fontSize = 11.sp)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        filteredCategories.forEach { cat ->
                            val isSelected = categoryId == cat.id
                            ElevatedButton(
                                onClick = { categoryId = cat.id },
                                colors = ButtonDefaults.elevatedButtonColors(
                                    containerColor = if (isSelected) AccentYellow else DarkBgEnd,
                                    contentColor = if (isSelected) Color.Black else Color.White
                                )
                            ) {
                                Text(cat.name, fontSize = 10.sp)
                            }
                        }
                    }

                    // Account Selector
                    Text(OjirkuStrings.get("account", lang), color = TextGray, fontSize = 11.sp)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        viewModel.accounts.forEach { acc ->
                            val isSelected = accountId == acc.id
                            ElevatedButton(
                                onClick = { accountId = acc.id },
                                colors = ButtonDefaults.elevatedButtonColors(
                                    containerColor = if (isSelected) AccentTeal else DarkBgEnd,
                                    contentColor = if (isSelected) Color.Black else Color.White
                                )
                            ) {
                                Text(acc.name, fontSize = 10.sp)
                            }
                        }
                    }

                    OutlinedTextField(
                        value = description,
                        onValueChange = { description = it },
                        singleLine = true,
                        label = { Text(OjirkuStrings.get("description", lang)) },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        TextButton(
                            onClick = { showAddTxDialog = false },
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(OjirkuStrings.get("cancel", lang), color = TextGray)
                        }

                        Button(
                            onClick = {
                                if (amountText.isNotEmpty() && categoryId != null && accountId != null) {
                                    viewModel.addTransaction(
                                        type = type,
                                        amount = amountText.toDouble(),
                                        categoryId = categoryId!!,
                                        accountId = accountId!!,
                                        description = description,
                                        date = System.currentTimeMillis()
                                    )
                                    showAddTxDialog = false
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = AccentTeal),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(OjirkuStrings.get("save", lang), color = Color.Black)
                        }
                    }
                }
            }
        }
    }
}

// --- SCREEN Budgets ---
@Composable
fun BudgetsScreen(viewModel: FinanceViewModel) {
    val lang = viewModel.appLanguage
    var showAddBudgetDialog by remember { mutableStateOf(false) }

    Box(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Text(
                text = OjirkuStrings.get("budgets", lang).uppercase(),
                fontSize = 20.sp,
                fontWeight = FontWeight.ExtraBold,
                color = Color.White
            )
            Spacer(modifier = Modifier.height(16.dp))

            if (viewModel.budgets.isEmpty()) {
                Text(
                    text = OjirkuStrings.get("empty_budgets", lang),
                    fontSize = 13.sp,
                    color = TextGray
                )
            } else {
                viewModel.budgets.forEach { budget ->
                    val catName = viewModel.categories.find { it.id == budget.categoryId }?.name ?: "Kategori"
                    val actualSpent = viewModel.calculateBudgetUsage(budget.categoryId)
                    val remaining = budget.amount - actualSpent
                    val percentage = if (budget.amount > 0) (actualSpent / budget.amount) else 0.0
                    val isOver = actualSpent > budget.amount

                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp),
                        colors = CardDefaults.cardColors(containerColor = CardBg)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(text = catName, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                IconButton(onClick = { viewModel.deleteBudget(budget) }) {
                                    Icon(Icons.Rounded.Delete, contentDescription = "Delete", tint = AccentOrange.copy(alpha = 0.8f))
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            LinearProgressIndicator(
                                progress = { percentage.coerceIn(0.0, 1.0).toFloat() },
                                color = if (isOver) Color.Red else AccentTeal,
                                trackColor = DarkBgEnd,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(10.dp)
                            )

                            Spacer(modifier = Modifier.height(10.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = OjirkuStrings.get("remaining", lang) + ": " + formatRupiah(remaining),
                                    fontSize = 12.sp,
                                    color = if (isOver) Color.Red else AccentTeal,
                                    fontWeight = FontWeight.Bold
                                )

                                Text(
                                    text = OjirkuStrings.get("limit", lang) + ": " + formatRupiah(budget.amount),
                                    fontSize = 11.sp,
                                    color = TextGray
                                )
                            }
                        }
                    }
                }
            }
        }

        FloatingActionButton(
            onClick = { showAddBudgetDialog = true },
            containerColor = AccentTeal,
            contentColor = Color.Black,
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(24.dp)
        ) {
            Icon(Icons.Rounded.Add, contentDescription = "Add Budget")
        }
    }

    if (showAddBudgetDialog) {
        var selectedCatId by remember { mutableStateOf<Long?>(null) }
        var budgetAmountText by remember { mutableStateOf("") }

        val expenseCategories = viewModel.categories.filter { it.type == "EXPENSE" }
        if (selectedCatId == null && expenseCategories.isNotEmpty()) {
            selectedCatId = expenseCategories.first().id
        }

        Dialog(onDismissRequest = { showAddBudgetDialog = false }) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = CardBg),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Text(
                        text = OjirkuStrings.get("add_budget", lang),
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )

                    // Category Selector
                    Text(OjirkuStrings.get("category", lang), color = TextGray, fontSize = 11.sp)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        expenseCategories.forEach { cat ->
                            val isSelected = selectedCatId == cat.id
                            ElevatedButton(
                                onClick = { selectedCatId = cat.id },
                                colors = ButtonDefaults.elevatedButtonColors(
                                    containerColor = if (isSelected) AccentYellow else DarkBgEnd,
                                    contentColor = if (isSelected) Color.Black else Color.White
                                )
                            ) {
                                Text(cat.name, fontSize = 10.sp)
                            }
                        }
                    }

                    OutlinedTextField(
                        value = budgetAmountText,
                        onValueChange = { if (it.all { c -> c.isDigit() }) budgetAmountText = it },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        label = { Text(OjirkuStrings.get("amount", lang)) },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        TextButton(
                            onClick = { showAddBudgetDialog = false },
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(OjirkuStrings.get("cancel", lang), color = TextGray)
                        }

                        Button(
                            onClick = {
                                if (selectedCatId != null && budgetAmountText.isNotEmpty()) {
                                    viewModel.addOrUpdateBudget(selectedCatId!!, budgetAmountText.toDouble(), "monthly")
                                    showAddBudgetDialog = false
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = AccentTeal),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(OjirkuStrings.get("save", lang), color = Color.Black)
                        }
                    }
                }
            }
        }
    }
}

// --- SCREEN Goals ---
@Composable
fun GoalsScreen(viewModel: FinanceViewModel) {
    val lang = viewModel.appLanguage
    var showAddGoalDialog by remember { mutableStateOf(false) }

    Box(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Text(
                text = OjirkuStrings.get("goals", lang).uppercase(),
                fontSize = 20.sp,
                fontWeight = FontWeight.ExtraBold,
                color = Color.White
            )
            Spacer(modifier = Modifier.height(16.dp))

            if (viewModel.goals.isEmpty()) {
                Text(
                    text = OjirkuStrings.get("empty_goals", lang),
                    fontSize = 13.sp,
                    color = TextGray
                )
            } else {
                viewModel.goals.forEach { goal ->
                    val percentage = if (goal.targetAmount > 0) (goal.currentAmount / goal.targetAmount) else 0.0
                    var logSavingsText by remember { mutableStateOf("") }
                    var isSavingActive by remember { mutableStateOf(false) }

                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp),
                        colors = CardDefaults.cardColors(containerColor = CardBg)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(text = goal.name, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                Row {
                                    IconButton(onClick = { isSavingActive = !isSavingActive }) {
                                        Icon(Icons.Rounded.AccountBalanceWallet, contentDescription = "Savings", tint = AccentTeal)
                                    }
                                    IconButton(onClick = { viewModel.deleteGoal(goal) }) {
                                        Icon(Icons.Rounded.Delete, contentDescription = "Delete", tint = AccentOrange.copy(alpha = 0.8f))
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            LinearProgressIndicator(
                                progress = { percentage.coerceIn(0.0, 1.0).toFloat() },
                                color = AccentYellow,
                                trackColor = DarkBgEnd,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(10.dp)
                            )

                            Spacer(modifier = Modifier.height(10.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = OjirkuStrings.get("saved", lang) + ": " + formatRupiah(goal.currentAmount),
                                    fontSize = 11.sp,
                                    color = AccentYellow,
                                    fontWeight = FontWeight.Bold
                                )

                                Text(
                                    text = OjirkuStrings.get("target", lang) + ": " + formatRupiah(goal.targetAmount),
                                    fontSize = 11.sp,
                                    color = TextGray
                                )
                            }

                            if (isSavingActive) {
                                Spacer(modifier = Modifier.height(12.dp))
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    OutlinedTextField(
                                        value = logSavingsText,
                                        onValueChange = { if (it.all { c -> c.isDigit() }) logSavingsText = it },
                                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                        singleLine = true,
                                        placeholder = { Text("Rp") },
                                        modifier = Modifier.weight(1f)
                                    )

                                    Button(
                                        onClick = {
                                            if (logSavingsText.isNotEmpty()) {
                                                val amt = logSavingsText.toDouble()
                                                viewModel.updateGoal(goal.copy(currentAmount = goal.currentAmount + amt))
                                                logSavingsText = ""
                                                isSavingActive = false
                                            }
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = AccentYellow)
                                    ) {
                                        Text("+", color = Color.Black, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        FloatingActionButton(
            onClick = { showAddGoalDialog = true },
            containerColor = AccentTeal,
            contentColor = Color.Black,
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(24.dp)
        ) {
            Icon(Icons.Rounded.Add, contentDescription = "Add Goal")
        }
    }

    if (showAddGoalDialog) {
        var nameText by remember { mutableStateOf("") }
        var targetText by remember { mutableStateOf("") }

        Dialog(onDismissRequest = { showAddGoalDialog = false }) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = CardBg),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Text(
                        text = OjirkuStrings.get("add_goal", lang),
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )

                    OutlinedTextField(
                        value = nameText,
                        onValueChange = { nameText = it },
                        singleLine = true,
                        label = { Text("Goal Title") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = targetText,
                        onValueChange = { if (it.all { c -> c.isDigit() }) targetText = it },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        label = { Text(OjirkuStrings.get("amount", lang)) },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        TextButton(
                            onClick = { showAddGoalDialog = false },
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(OjirkuStrings.get("cancel", lang), color = TextGray)
                        }

                        Button(
                            onClick = {
                                if (nameText.isNotBlank() && targetText.isNotEmpty()) {
                                    viewModel.addGoal(nameText, targetText.toDouble(), 0.0)
                                    showAddGoalDialog = false
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = AccentTeal),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(OjirkuStrings.get("save", lang), color = Color.Black)
                        }
                    }
                }
            }
        }
    }
}

// --- SCREEN Debts ---
@Composable
fun DebtsScreen(viewModel: FinanceViewModel) {
    val lang = viewModel.appLanguage
    var showAddDebtDialog by remember { mutableStateOf(false) }

    Box(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Text(
                text = OjirkuStrings.get("debts", lang).uppercase(),
                fontSize = 20.sp,
                fontWeight = FontWeight.ExtraBold,
                color = Color.White
            )
            Spacer(modifier = Modifier.height(16.dp))

            if (viewModel.debts.isEmpty()) {
                Text(
                    text = OjirkuStrings.get("empty_debts", lang),
                    fontSize = 13.sp,
                    color = TextGray
                )
            } else {
                viewModel.debts.forEach { debt ->
                    val percentage = if (debt.totalAmount > 0) (debt.amountPaid / debt.totalAmount) else 0.0
                    var isPaymentLogsOpen by remember { mutableStateOf(false) }
                    var paymentsList by remember { mutableStateOf<List<DebtPaymentEntity>>(emptyList()) }
                    var showRecordPaymentDialog by remember { mutableStateOf(false) }

                    // Local hook to trigger lists load
                    LaunchedEffect(isPaymentLogsOpen) {
                        if (isPaymentLogsOpen) {
                            viewModel.getDebtPayments(debt.id) { list ->
                                paymentsList = list
                            }
                        }
                    }

                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp),
                        colors = CardDefaults.cardColors(containerColor = CardBg)
                    ) {
                        Column(modifier = Modifier.padding(15.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(text = debt.name, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                    Text(
                                        text = OjirkuStrings.get("lender", lang) + ": " + debt.lender,
                                        fontSize = 11.sp,
                                        color = TextGray
                                    )
                                }
                                Row {
                                    IconButton(onClick = { showRecordPaymentDialog = true }) {
                                        Icon(Icons.Rounded.Payments, contentDescription = "Pay", tint = AccentTeal)
                                    }
                                    IconButton(onClick = { isPaymentLogsOpen = !isPaymentLogsOpen }) {
                                        Icon(
                                            imageVector = if (isPaymentLogsOpen) Icons.Rounded.ExpandLess else Icons.Rounded.ExpandMore,
                                            contentDescription = "Expand",
                                            tint = AccentYellow
                                        )
                                    }
                                    IconButton(onClick = { viewModel.deleteDebt(debt) }) {
                                        Icon(Icons.Rounded.Delete, contentDescription = "Delete", tint = AccentOrange.copy(alpha = 0.8f))
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            LinearProgressIndicator(
                                progress = { percentage.coerceIn(0.0, 1.0).toFloat() },
                                color = AccentOrange,
                                trackColor = DarkBgEnd,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(8.dp)
                            )

                            Spacer(modifier = Modifier.height(8.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = OjirkuStrings.get("amount_paid", lang) + ": " + formatRupiah(debt.amountPaid),
                                    fontSize = 11.sp,
                                    color = AccentOrange,
                                    fontWeight = FontWeight.Bold
                                )

                                Text(
                                    text = "Total: " + formatRupiah(debt.totalAmount),
                                    fontSize = 11.sp,
                                    color = TextGray
                                )
                            }

                            if (isPaymentLogsOpen) {
                                Spacer(modifier = Modifier.height(12.dp))
                                Text(
                                    text = OjirkuStrings.get("payments", lang).uppercase(),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 11.sp,
                                    color = AccentYellow
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                if (paymentsList.isEmpty()) {
                                    Text(text = "-", color = TextGray, fontSize = 11.sp)
                                } else {
                                    val sDF = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
                                    paymentsList.forEach { payment ->
                                        Row(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .padding(vertical = 2.dp),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Text(
                                                text = sDF.format(Date(payment.date)),
                                                color = TextGray,
                                                fontSize = 11.sp
                                            )
                                            Text(
                                                text = formatRupiah(payment.amount),
                                                color = Color.White,
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (showRecordPaymentDialog) {
                        var logAmountText by remember { mutableStateOf("") }
                        var activeWalletId by remember { mutableStateOf<Long?>(null) }

                        if (activeWalletId == null && viewModel.accounts.isNotEmpty()) {
                            activeWalletId = viewModel.accounts.first().id
                        }

                        Dialog(onDismissRequest = { showRecordPaymentDialog = false }) {
                            Card(
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = CardBg),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp)
                            ) {
                                Column(
                                    modifier = Modifier.padding(20.dp),
                                    verticalArrangement = Arrangement.spacedBy(12.dp)
                                ) {
                                    Text(
                                        text = OjirkuStrings.get("log_payment", lang),
                                        fontSize = 16.sp,
                                        fontWeight = FontWeight.Bold
                                    )

                                    OutlinedTextField(
                                        value = logAmountText,
                                        onValueChange = { if (it.all { c -> c.isDigit() }) logAmountText = it },
                                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                        singleLine = true,
                                        label = { Text(OjirkuStrings.get("amount", lang)) },
                                        modifier = Modifier.fillMaxWidth()
                                    )

                                    // Account selector row
                                    Text("Wallet", color = TextGray, fontSize = 11.sp)
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .horizontalScroll(rememberScrollState()),
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        viewModel.accounts.forEach { wallet ->
                                            val isSelected = activeWalletId == wallet.id
                                            ElevatedButton(
                                                onClick = { activeWalletId = wallet.id },
                                                colors = ButtonDefaults.elevatedButtonColors(
                                                    containerColor = if (isSelected) AccentTeal else DarkBgEnd,
                                                    contentColor = if (isSelected) Color.Black else Color.White
                                                )
                                            ) {
                                                Text(wallet.name, fontSize = 9.sp)
                                            }
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(10.dp))

                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                                    ) {
                                        TextButton(onClick = { showRecordPaymentDialog = false }) {
                                            Text(OjirkuStrings.get("cancel", lang), color = TextGray)
                                        }

                                        Button(
                                            onClick = {
                                                if (logAmountText.isNotEmpty() && activeWalletId != null) {
                                                    viewModel.payDebt(
                                                        debt = debt,
                                                        amount = logAmountText.toDouble(),
                                                        accountId = activeWalletId!!,
                                                        date = System.currentTimeMillis()
                                                    )
                                                    showRecordPaymentDialog = false
                                                }
                                            },
                                            colors = ButtonDefaults.buttonColors(containerColor = AccentTeal)
                                        ) {
                                            Text(OjirkuStrings.get("save", lang), color = Color.Black)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        FloatingActionButton(
            onClick = { showAddDebtDialog = true },
            containerColor = AccentTeal,
            contentColor = Color.Black,
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(24.dp)
        ) {
            Icon(Icons.Rounded.Add, contentDescription = "Add Debt")
        }
    }

    if (showAddDebtDialog) {
        var labelText by remember { mutableStateOf("") }
        var lenderText by remember { mutableStateOf("") }
        var totalAmountText by remember { mutableStateOf("") }

        Dialog(onDismissRequest = { showAddDebtDialog = false }) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = CardBg),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Text(
                        text = OjirkuStrings.get("add_debt", lang),
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )

                    OutlinedTextField(
                        value = labelText,
                        onValueChange = { labelText = it },
                        singleLine = true,
                        label = { Text("Debt Name") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = lenderText,
                        onValueChange = { lenderText = it },
                        singleLine = true,
                        label = { Text(OjirkuStrings.get("lender", lang)) },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = totalAmountText,
                        onValueChange = { if (it.all { c -> c.isDigit() }) totalAmountText = it },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        label = { Text(OjirkuStrings.get("amount", lang)) },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        TextButton(
                            onClick = { showAddDebtDialog = false },
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(OjirkuStrings.get("cancel", lang), color = TextGray)
                        }

                        Button(
                            onClick = {
                                if (labelText.isNotBlank() && lenderText.isNotBlank() && totalAmountText.isNotEmpty()) {
                                    viewModel.addDebt(labelText, lenderText, totalAmountText.toDouble())
                                    showAddDebtDialog = false
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = AccentTeal),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(OjirkuStrings.get("save", lang), color = Color.Black)
                        }
                    }
                }
            }
        }
    }
}

// --- SCREEN Reports ---
@Composable
fun ReportsScreen(viewModel: FinanceViewModel) {
    val lang = viewModel.appLanguage

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = OjirkuStrings.get("reports", lang).uppercase(),
            fontSize = 20.sp,
            fontWeight = FontWeight.ExtraBold,
            color = Color.White
        )
        Text(
            text = OjirkuStrings.get("ai_report_intro", lang),
            fontSize = 12.sp,
            color = TextGray
        )

        Spacer(modifier = Modifier.height(20.dp))

        Button(
            onClick = { viewModel.generateAiReport() },
            colors = ButtonDefaults.buttonColors(containerColor = AccentYellow),
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp),
            enabled = !viewModel.isGeneratingAiReport
        ) {
            Icon(Icons.Rounded.AutoAwesome, contentDescription = "AI", tint = Color.Black)
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = if (viewModel.isGeneratingAiReport) {
                    OjirkuStrings.get("generating", lang)
                } else {
                    OjirkuStrings.get("generate_ai_report", lang).uppercase()
                },
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Card(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f),
            colors = CardDefaults.cardColors(containerColor = CardBg),
            shape = RoundedCornerShape(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                if (viewModel.isGeneratingAiReport) {
                    CircularProgressIndicator(
                        color = AccentYellow,
                        modifier = Modifier.align(Alignment.Center)
                    )
                } else {
                    val reportContent = viewModel.aiReport.ifEmpty {
                        if (lang == "en") "Press the button above to scout and analyze your financial footprint with Ojirku AI."
                        else "Tekan tombol di atas untuk menganalisis jejak keuangan Anda bersama AI Ojirku."
                    }
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .verticalScroll(rememberScrollState())
                    ) {
                        Text(
                            text = reportContent,
                            fontSize = 14.sp,
                            color = Color.White,
                            lineHeight = 22.sp
                        )
                    }
                }
            }
        }
    }
}

// --- SCREEN Settings ---
@Composable
fun SettingsScreen(viewModel: FinanceViewModel) {
    val lang = viewModel.appLanguage
    var showPinDialog by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        Text(
            text = OjirkuStrings.get("settings", lang).uppercase(),
            fontSize = 20.sp,
            fontWeight = FontWeight.ExtraBold,
            color = Color.White
        )

        // General Panel Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = CardBg)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text(
                    text = OjirkuStrings.get("language", lang),
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    ElevatedButton(
                        onClick = { viewModel.updateLanguage("id") },
                        colors = ButtonDefaults.elevatedButtonColors(
                            containerColor = if (lang == "id") AccentTeal else DarkBgEnd,
                            contentColor = if (lang == "id") Color.Black else Color.White
                        ),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Bahasa Indonesia", fontSize = 12.sp)
                    }

                    ElevatedButton(
                        onClick = { viewModel.updateLanguage("en") },
                        colors = ButtonDefaults.elevatedButtonColors(
                            containerColor = if (lang == "en") AccentTeal else DarkBgEnd,
                            contentColor = if (lang == "en") Color.Black else Color.White
                        ),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("English", fontSize = 12.sp)
                    }
                }

                HorizontalDivider(color = DarkBgEnd)

                // Change PIN code
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { showPinDialog = true },
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Rounded.Lock, contentDescription = "PIN", tint = AccentYellow)
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(text = OjirkuStrings.get("pin_setup", lang), fontWeight = FontWeight.SemiBold)
                    }
                    Icon(Icons.Rounded.ChevronRight, contentDescription = "Go", tint = TextGray)
                }

                HorizontalDivider(color = DarkBgEnd)

                // Reset App Data
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { viewModel.resetAllData() },
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Rounded.Clear, contentDescription = "Reset", tint = AccentOrange)
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(text = OjirkuStrings.get("reset_data", lang), fontWeight = FontWeight.SemiBold, color = AccentOrange)
                    }
                    Icon(Icons.Rounded.ChevronRight, contentDescription = "Go", tint = TextGray)
                }
            }
        }

        // Logout Button Action
        Button(
            onClick = { viewModel.logout() },
            colors = ButtonDefaults.buttonColors(containerColor = AccentOrange),
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(Icons.Rounded.Logout, contentDescription = "Logout")
            Spacer(modifier = Modifier.width(8.dp))
            Text("LOCK APP", fontWeight = FontWeight.Bold)
        }
    }

    if (showPinDialog) {
        var inputCode by remember { mutableStateOf("") }
        val context = LocalContext.current

        Dialog(onDismissRequest = { showPinDialog = false }) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = CardBg),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Text(
                        text = OjirkuStrings.get("pin_setup", lang),
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )

                    OutlinedTextField(
                        value = inputCode,
                        onValueChange = { if (it.length <= 4 && it.all { c -> c.isDigit() }) inputCode = it },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
                        visualTransformation = PasswordVisualTransformation(),
                        singleLine = true,
                        label = { Text("4 Digit PIN") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        TextButton(
                            onClick = { showPinDialog = false },
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(OjirkuStrings.get("cancel", lang), color = TextGray)
                        }

                        Button(
                            onClick = {
                                if (inputCode.length == 4) {
                                    viewModel.setupPin(inputCode)
                                    showPinDialog = false
                                    Toast.makeText(context, "PIN Updated!", Toast.LENGTH_SHORT).show()
                                } else {
                                    Toast.makeText(context, OjirkuStrings.get("pin_length_err", lang), Toast.LENGTH_SHORT).show()
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = AccentTeal),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(OjirkuStrings.get("save", lang), color = Color.Black)
                        }
                    }
                }
            }
        }
    }
}
