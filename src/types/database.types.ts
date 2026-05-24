export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      Role: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          permissions: Json;
          isSystem: boolean;
          defaultRoute: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database["public"]["Tables"]["Role"]["Row"], "createdAt" | "updatedAt"> & {
          createdAt?: string;
          updatedAt?: string;
          isSystem?: boolean;
          permissions?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["Role"]["Insert"]>;
      };
      User: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          role: string;
          passwordHash: string;
          avatar: string | null;
          defaultRoute: string | null;
          monthlySalary: number | null;
          active: boolean;
          overtimeRate: number;
          standardWorkingDays: number;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database["public"]["Tables"]["User"]["Row"], "id" | "createdAt" | "updatedAt"> & {
          id?: string;
          createdAt?: string;
          updatedAt?: string;
          active?: boolean;
          overtimeRate?: number;
          standardWorkingDays?: number;
        };
        Update: Partial<Database["public"]["Tables"]["User"]["Insert"]>;
      };
      Workspace: {
        Row: {
          id: string;
          name: string;
          legalEntity: string | null;
          taxId: string | null;
          phone: string | null;
          currency: string;
          timezone: string;
          city: string | null;
          addressLine: string | null;
          receiptFooter: string | null;
          receiptWidth: string;
          hoursMonOpen: string | null; hoursMonClose: string | null;
          hoursTueOpen: string | null; hoursTueClose: string | null;
          hoursWedOpen: string | null; hoursWedClose: string | null;
          hoursThuOpen: string | null; hoursThuClose: string | null;
          hoursFriOpen: string | null; hoursFriClose: string | null;
          hoursSatOpen: string | null; hoursSatClose: string | null;
          hoursSunOpen: string | null; hoursSunClose: string | null;
          updatedAt: string;
        };
        Insert: Partial<Database["public"]["Tables"]["Workspace"]["Row"]> & { id?: string; name: string };
        Update: Partial<Database["public"]["Tables"]["Workspace"]["Row"]>;
      };
      KitchenStation: {
        Row: { id: string; name: string; printer: string | null; color: string; active: boolean };
        Insert: Omit<Database["public"]["Tables"]["KitchenStation"]["Row"], "active"> & { active?: boolean };
        Update: Partial<Database["public"]["Tables"]["KitchenStation"]["Row"]>;
      };
      MenuCategory: {
        Row: { id: string; name: string; slug: string; color: string };
        Insert: Database["public"]["Tables"]["MenuCategory"]["Row"];
        Update: Partial<Database["public"]["Tables"]["MenuCategory"]["Row"]>;
      };
      Table: {
        Row: { id: string; name: string; capacity: number; occupancy: number; waiterId: string | null };
        Insert: Omit<Database["public"]["Tables"]["Table"]["Row"], "capacity" | "occupancy"> & { capacity?: number; occupancy?: number };
        Update: Partial<Database["public"]["Tables"]["Table"]["Row"]>;
      };
      Supplier: {
        Row: { id: string; name: string; contact: string; email: string; phone: string; address: string | null; rating: number };
        Insert: Omit<Database["public"]["Tables"]["Supplier"]["Row"], "rating"> & { rating?: number };
        Update: Partial<Database["public"]["Tables"]["Supplier"]["Row"]>;
      };
      InventoryItem: {
        Row: {
          id: string; name: string; sku: string; category: string; unit: string;
          stock: number; reorderLevel: number; costPerUnit: number;
          supplierId: string | null; lastRestocked: string | null; expiresAt: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["InventoryItem"]["Row"], "stock" | "reorderLevel" | "costPerUnit"> & { stock?: number; reorderLevel?: number; costPerUnit?: number };
        Update: Partial<Database["public"]["Tables"]["InventoryItem"]["Row"]>;
      };
      MenuItem: {
        Row: {
          id: string; name: string; description: string | null; categoryId: string; stationId: string;
          price: number; cost: number | null; sku: string | null; pctCode: string | null; image: string | null;
          available: boolean; posVisible: boolean; popular: boolean; prepTimeMinutes: number | null; modifiers: Json;
        };
        Insert: Omit<Database["public"]["Tables"]["MenuItem"]["Row"], "available" | "posVisible" | "popular" | "modifiers"> & { available?: boolean; posVisible?: boolean; popular?: boolean; modifiers?: Json };
        Update: Partial<Database["public"]["Tables"]["MenuItem"]["Row"]>;
      };
      RecipeIngredient: {
        Row: { menuItemId: string; inventoryItemId: string; quantity: number; unit: string };
        Insert: Database["public"]["Tables"]["RecipeIngredient"]["Row"];
        Update: Partial<Database["public"]["Tables"]["RecipeIngredient"]["Row"]>;
      };
      PaymentChannel: {
        Row: { id: string; name: string; kind: string; openingBalance: number; currentBalance: number; archived: boolean; archivedAt: string | null; createdAt: string };
        Insert: Omit<Database["public"]["Tables"]["PaymentChannel"]["Row"], "openingBalance" | "currentBalance" | "archived" | "createdAt"> & { openingBalance?: number; currentBalance?: number; archived?: boolean; createdAt?: string };
        Update: Partial<Database["public"]["Tables"]["PaymentChannel"]["Row"]>;
      };
      Order: {
        Row: {
          id: string; number: string; status: string; channel: string;
          customerName: string | null; customerPhone: string | null; notes: string | null;
          tableId: string | null; staffId: string | null; assignedStaffId: string | null;
          subtotal: number; tax: number; tip: number; discount: number; total: number;
          payment: string | null; paymentChannelId: string | null; paidAt: string | null;
          guests: number; fiscalInvoiceNumber: string | null; fiscalLastError: string | null;
          fiscalSubmittedAt: string | null; fiscalAttempts: number;
          createdAt: string; updatedAt: string;
        };
        Insert: Omit<Database["public"]["Tables"]["Order"]["Row"], "subtotal" | "tax" | "tip" | "discount" | "total" | "guests" | "fiscalAttempts" | "createdAt" | "updatedAt"> & { subtotal?: number; tax?: number; tip?: number; discount?: number; total?: number; guests?: number; fiscalAttempts?: number; createdAt?: string; updatedAt?: string };
        Update: Partial<Database["public"]["Tables"]["Order"]["Row"]>;
      };
      OrderItem: {
        Row: { id: string; orderId: string; menuItemId: string | null; name: string; note: string | null; quantity: number; unitPrice: number; modifiers: Json; preparedAt: string | null };
        Insert: Omit<Database["public"]["Tables"]["OrderItem"]["Row"], "quantity" | "modifiers"> & { quantity?: number; modifiers?: Json };
        Update: Partial<Database["public"]["Tables"]["OrderItem"]["Row"]>;
      };
      KitchenTicket: {
        Row: { id: string; orderId: string; stationId: string; status: string; createdAt: string };
        Insert: Omit<Database["public"]["Tables"]["KitchenTicket"]["Row"], "status" | "createdAt"> & { status?: string; createdAt?: string };
        Update: Partial<Database["public"]["Tables"]["KitchenTicket"]["Row"]>;
      };
      InventoryMovement: {
        Row: { id: string; inventoryItemId: string; orderId: string | null; supplierId: string | null; paymentChannelId: string | null; delta: number; reason: string; amount: number | null; paidAmount: number | null; createdAt: string };
        Insert: Omit<Database["public"]["Tables"]["InventoryMovement"]["Row"], "createdAt"> & { createdAt?: string };
        Update: Partial<Database["public"]["Tables"]["InventoryMovement"]["Row"]>;
      };
      SupplierPayment: {
        Row: { id: string; supplierId: string; paymentChannelId: string; amount: number; note: string | null; createdAt: string };
        Insert: Omit<Database["public"]["Tables"]["SupplierPayment"]["Row"], "createdAt"> & { createdAt?: string };
        Update: Partial<Database["public"]["Tables"]["SupplierPayment"]["Row"]>;
      };
      PaymentTransfer: {
        Row: { id: string; fromId: string; toId: string; amount: number; occurredAt: string; note: string | null };
        Insert: Omit<Database["public"]["Tables"]["PaymentTransfer"]["Row"], "occurredAt"> & { occurredAt?: string };
        Update: Partial<Database["public"]["Tables"]["PaymentTransfer"]["Row"]>;
      };
      ExpenseHead: {
        Row: { id: string; name: string; archived: boolean; archivedAt: string | null; createdAt: string };
        Insert: Omit<Database["public"]["Tables"]["ExpenseHead"]["Row"], "archived" | "createdAt"> & { archived?: boolean; createdAt?: string };
        Update: Partial<Database["public"]["Tables"]["ExpenseHead"]["Row"]>;
      };
      Expense: {
        Row: { id: string; expenseHeadId: string; paymentChannelId: string; amount: number; detail: string | null; occurredAt: string; createdAt: string };
        Insert: Omit<Database["public"]["Tables"]["Expense"]["Row"], "occurredAt" | "createdAt"> & { occurredAt?: string; createdAt?: string };
        Update: Partial<Database["public"]["Tables"]["Expense"]["Row"]>;
      };
      SalaryPayment: {
        Row: { id: string; userId: string; month: string; paymentDate: string; absentDays: number; netPaid: number; paymentChannelId: string | null; notes: string | null };
        Insert: Omit<Database["public"]["Tables"]["SalaryPayment"]["Row"], "paymentDate" | "absentDays"> & { paymentDate?: string; absentDays?: number };
        Update: Partial<Database["public"]["Tables"]["SalaryPayment"]["Row"]>;
      };
      StaffAdvance: {
        Row: { id: string; userId: string; month: string; amount: number; date: string; paymentChannelId: string; notes: string | null };
        Insert: Omit<Database["public"]["Tables"]["StaffAdvance"]["Row"], "date"> & { date?: string };
        Update: Partial<Database["public"]["Tables"]["StaffAdvance"]["Row"]>;
      };
      StaffOvertime: {
        Row: { id: string; userId: string; month: string; hours: number; rate: number; createdAt: string };
        Insert: Omit<Database["public"]["Tables"]["StaffOvertime"]["Row"], "createdAt"> & { createdAt?: string };
        Update: Partial<Database["public"]["Tables"]["StaffOvertime"]["Row"]>;
      };
      Shift: {
        Row: { id: string; userId: string; date: string; start: string; end: string; status: string; notes: string | null };
        Insert: Omit<Database["public"]["Tables"]["Shift"]["Row"], "status"> & { status?: string };
        Update: Partial<Database["public"]["Tables"]["Shift"]["Row"]>;
      };
      TaxConfig: {
        Row: { id: string; rate: number; label: string };
        Insert: Partial<Database["public"]["Tables"]["TaxConfig"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["TaxConfig"]["Row"]>;
      };
      FiscalConfig: {
        Row: { id: string; enabled: boolean; mode: string; environment: string; posId: string; localBaseUrl: string; defaultPctCode: string; businessName: string | null; bntn: string | null; accessCode: string | null; bearerToken: string | null; autoSubmit: boolean; updatedAt: string };
        Insert: Partial<Database["public"]["Tables"]["FiscalConfig"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["FiscalConfig"]["Row"]>;
      };
      FiscalSubmission: {
        Row: { id: string; orderId: string; mode: string; environment: string; endpoint: string; succeeded: boolean; responseCode: string | null; responseMessage: string | null; errorMessage: string | null; fiscalInvoiceNumber: string | null; attemptedAt: string; requestBody: Json | null; responseBody: Json | null };
        Insert: Omit<Database["public"]["Tables"]["FiscalSubmission"]["Row"], "succeeded" | "attemptedAt"> & { succeeded?: boolean; attemptedAt?: string };
        Update: Partial<Database["public"]["Tables"]["FiscalSubmission"]["Row"]>;
      };
      PendingMember: {
        Row: { id: string; name: string; email: string; phone: string; createdAt: string };
        Insert: Omit<Database["public"]["Tables"]["PendingMember"]["Row"], "createdAt"> & { createdAt?: string };
        Update: Partial<Database["public"]["Tables"]["PendingMember"]["Row"]>;
      };
      PushSubscription: {
        Row: { endpoint: string; userId: string; p256dh: string; auth: string; userAgent: string | null };
        Insert: Database["public"]["Tables"]["PushSubscription"]["Row"];
        Update: Partial<Database["public"]["Tables"]["PushSubscription"]["Row"]>;
      };
      Activity: {
        Row: { id: string; type: string; title: string; description: string; actorName: string | null; createdAt: string };
        Insert: Omit<Database["public"]["Tables"]["Activity"]["Row"], "createdAt"> & { createdAt?: string };
        Update: Partial<Database["public"]["Tables"]["Activity"]["Row"]>;
      };
    };
  };
};
