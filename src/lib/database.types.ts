export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    role: 'admin' | 'customer'
                    created_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    role?: 'admin' | 'customer'
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    role?: 'admin' | 'customer'
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    created_at?: string
                }
                Relationships: []
            }
            products: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    description: string | null
                    price_cents: number
                    currency: string
                    age_min: number | null
                    age_max: number | null
                    category_id: string | null
                    stock: number
                    is_active: boolean
                    image_urls: string[]
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    description?: string | null
                    price_cents: number
                    currency?: string
                    age_min?: number | null
                    age_max?: number | null
                    category_id?: string | null
                    stock?: number
                    is_active?: boolean
                    image_urls?: string[]
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    description?: string | null
                    price_cents?: number
                    currency?: string
                    age_min?: number | null
                    age_max?: number | null
                    category_id?: string | null
                    stock?: number
                    is_active?: boolean
                    image_urls?: string[]
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "products_category_id_fkey"
                        columns: ["category_id"]
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            is_admin: {
                Args: {
                    uid: string
                }
                Returns: boolean
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
