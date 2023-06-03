export type JobLog = {
    jid: string,
    title?: string,
    provider_id: number,
    status: JobLogStatus,
    error?: string,
}

export type JobLogStatus = 'sent' | 'error';