export type EnsureNonNullable<T, K extends keyof T> = T & {
    [P in K]-?: NonNullable<T[P]>;
};
//# sourceMappingURL=types-helper.d.ts.map