export type PurchasePlanDbInsert = typeof purchasePlan.$inferInsert;
export declare const purchasePlan: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
    name: "purchase_plan";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "id";
            tableName: "purchase_plan";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            length: number | undefined;
        }>;
        userIdParent: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "user_id_parent";
            tableName: "purchase_plan";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            length: number | undefined;
        }>;
        userIdCreator: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "user_id_creator";
            tableName: "purchase_plan";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            length: number | undefined;
        }>;
        vendorId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "vendor_id";
            tableName: "purchase_plan";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            length: number | undefined;
        }>;
        totalCost: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "total_cost";
            tableName: "purchase_plan";
            dataType: "number";
            columnType: "SQLiteInteger";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "created_at";
            tableName: "purchase_plan";
            dataType: "date";
            columnType: "SQLiteTimestamp";
            data: Date;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: true;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        orderedAt: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "ordered_at";
            tableName: "purchase_plan";
            dataType: "date";
            columnType: "SQLiteTimestamp";
            data: Date;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: true;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        modifiedAt: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "modified_at";
            tableName: "purchase_plan";
            dataType: "date";
            columnType: "SQLiteTimestamp";
            data: Date;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "sqlite";
}>;
export declare const purchasePlanRelations: import("drizzle-orm").Relations<"purchase_plan", {
    userParent: import("drizzle-orm").One<"user", true>;
    userCreator: import("drizzle-orm").One<"user", true>;
    vendor: import("drizzle-orm").One<"vendor", true>;
    purchasePlanItem: import("drizzle-orm").Many<"purchase_plan_item">;
}>;
//# sourceMappingURL=purchasePlan.schema.d.ts.map