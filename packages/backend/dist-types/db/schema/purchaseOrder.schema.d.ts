export type PurchaseOrderDbInsert = typeof purchaseOrder.$inferInsert;
export declare const purchaseOrder: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
    name: "purchase_order";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "id";
            tableName: "purchase_order";
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
            tableName: "purchase_order";
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
            tableName: "purchase_order";
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
            tableName: "purchase_order";
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
            tableName: "purchase_order";
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
        imageId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "image_id";
            tableName: "purchase_order";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: false;
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
        createdAt: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "created_at";
            tableName: "purchase_order";
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
            tableName: "purchase_order";
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
            tableName: "purchase_order";
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
export declare const purchaseOrderRelations: import("drizzle-orm").Relations<"purchase_order", {
    userParent: import("drizzle-orm").One<"user", true>;
    userCreator: import("drizzle-orm").One<"user", true>;
    vendor: import("drizzle-orm").One<"vendor", true>;
    image: import("drizzle-orm").One<"image", false>;
    purchaseItem: import("drizzle-orm").Many<"purchase_item">;
}>;
//# sourceMappingURL=purchaseOrder.schema.d.ts.map