export interface IRepository<T> {
    findAll(): Promise<T[]>;
    findById(id: number): Promise<T>;
    find(query: {}): Promise<T>;
    getAppliedJobsByProvider(provider_id: number, limit: number): Promise<Set<string>>
}