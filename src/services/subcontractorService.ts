class SubcontractorService {
  async getAll() {
    return [];
  }

  async create(data: any) {
    return data;
  }

  async update(id: string, data: any) {
    return data;
  }

  async delete(id: string) {
    return { success: true };
  }
}

export default new SubcontractorService();