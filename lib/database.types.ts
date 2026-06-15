export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          nome: string;
          email: string;
          senha: string;
          role: 'admin' | 'collaborator' | 'student';
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          email: string;
          senha: string;
          role?: 'admin' | 'collaborator' | 'student';
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          email?: string;
          senha?: string;
          role?: 'admin' | 'collaborator' | 'student';
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          materia: string;
          assunto: string;
          enunciado: string;
          alternativas: string[];
          indice_correto: number;
          explicacao: string;
          created_at: string;
        };
        Insert: {
          id: string;
          materia: string;
          assunto: string;
          enunciado: string;
          alternativas: string[];
          indice_correto: number;
          explicacao: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          materia?: string;
          assunto?: string;
          enunciado?: string;
          alternativas?: string[];
          indice_correto?: number;
          explicacao?: string;
          created_at?: string;
        };
      };
      performance: {
        Row: {
          id: string;
          user_id: string | null;
          question_id: string;
          materia: string;
          assunto: string;
          is_correct: boolean;
          answered_at: string;
        };
        Insert: {
          id?: string;
          user_id: string | null;
          question_id: string;
          materia: string;
          assunto: string;
          is_correct: boolean;
          answered_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          question_id?: string;
          materia?: string;
          assunto?: string;
          is_correct?: boolean;
          answered_at?: string;
        };
      };
      error_notebook: {
        Row: {
          id: string;
          user_id: string | null;
          question_id: string;
          added_at: string;
        };
        Insert: {
          id?: string;
          user_id: string | null;
          question_id: string;
          added_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          question_id?: string;
          added_at?: string;
        };
      };
      user_comments: {
        Row: {
          id: string;
          user_id: string | null;
          question_id: string;
          comment: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string | null;
          question_id: string;
          comment: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          question_id?: string;
          comment?: string;
          updated_at?: string;
        };
      };
      question_feedback: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          mensagem: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          mensagem: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_id?: string;
          mensagem?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
