import React, { useState, useEffect } from 'react';
import { QuestionComment, User } from '../types';

interface CommentsSectionProps {
  questionId: string;
  currentUser: User | null;
  onLoadComments: (questionId: string) => Promise<QuestionComment[]>;
  onAddComment: (questionId: string, content: string, parentId: string | null) => Promise<boolean>;
  onDeleteComment: (commentId: string, questionId: string) => Promise<boolean>;
  onVoteComment: (commentId: string, voteType: 'like' | 'dislike', questionId: string) => Promise<boolean>;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  questionId,
  currentUser,
  onLoadComments,
  onAddComment,
  onDeleteComment,
  onVoteComment
}) => {
  const [comments, setComments] = useState<QuestionComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [questionId]);

  const loadComments = async () => {
    setLoading(true);
    const data = await onLoadComments(questionId);
    setComments(data);
    setLoading(false);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || submitting) return;
    setSubmitting(true);
    const success = await onAddComment(questionId, newComment.trim(), null);
    if (success) {
      setNewComment('');
      await loadComments();
    }
    setSubmitting(false);
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyText.trim() || submitting) return;
    setSubmitting(true);
    const success = await onAddComment(questionId, replyText.trim(), parentId);
    if (success) {
      setReplyText('');
      setReplyTo(null);
      await loadComments();
    }
    setSubmitting(false);
  };

  const handleVote = async (commentId: string, voteType: 'like' | 'dislike') => {
    await onVoteComment(commentId, voteType, questionId);
    await loadComments();
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) return;
    await onDeleteComment(commentId, questionId);
    await loadComments();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const mins = Math.floor(diff / (1000 * 60));
        return mins <= 1 ? 'agora' : `${mins} min atrás`;
      }
      return `${hours}h atrás`;
    }
    if (days === 1) return 'ontem';
    if (days < 7) return `${days} dias atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const CommentCard: React.FC<{ comment: QuestionComment; isReply?: boolean }> = ({ comment, isReply }) => (
    <div className={`${isReply ? 'ml-8 pl-4 border-l-2 border-legal-100' : 'border border-legal-100'} rounded-xl p-4 bg-white`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-legal-500 text-white flex items-center justify-center text-xs font-bold">
            {comment.userNome.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-semibold text-sm text-legal-900">{comment.userNome}</span>
            <span className="text-xs text-gray-400 ml-2">{formatDate(comment.createdAt)}</span>
          </div>
        </div>
        {currentUser?.id === comment.userId && (
          <button
            onClick={() => handleDelete(comment.id)}
            className="text-gray-300 hover:text-red-500 transition-colors"
            title="Excluir comentário"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-3">{comment.content}</p>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleVote(comment.id, 'like')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${comment.userVote === 'like' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span>{comment.likes}</span>
          </button>
          <button
            onClick={() => handleVote(comment.id, 'dislike')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${comment.userVote === 'dislike' ? 'bg-red-100 text-red-700' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l2.4-2.933a4 4 0 00.8-2.4z" />
            </svg>
            <span>{comment.dislikes}</span>
          </button>
        </div>

        {currentUser && !isReply && (
          <button
            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
            className="text-gray-400 hover:text-legal-600 font-medium transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Responder
          </button>
        )}
      </div>

      {replyTo === comment.id && (
        <div className="mt-3 animate-fadeIn">
          <textarea
            className="w-full border border-legal-200 rounded-xl p-3 text-sm outline-none focus:border-legal-500 resize-none bg-legal-50/20"
            rows={2}
            placeholder="Escreva sua resposta..."
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleSubmitReply(comment.id)}
              disabled={!replyText.trim() || submitting}
              className="bg-legal-500 hover:bg-legal-600 disabled:bg-gray-200 text-white px-4 py-1.5 rounded-lg font-bold text-xs transition-all"
            >
              {submitting ? 'Enviando...' : 'Responder'}
            </button>
            <button
              onClick={() => { setReplyTo(null); setReplyText(''); }}
              className="border border-legal-200 text-legal-600 px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-legal-50 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {comment.replies.map(reply => (
        <CommentCard key={reply.id} comment={reply} isReply />
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-legal-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clipRule="evenodd" />
        </svg>
        <h4 className="font-bold text-legal-800 text-sm">Comentários</h4>
        {!loading && <span className="text-xs text-gray-400">({comments.length})</span>}
      </div>

      {currentUser && (
        <div className="space-y-2">
          <textarea
            className="w-full border border-legal-200 rounded-xl p-3 text-sm outline-none focus:border-legal-500 resize-none bg-legal-50/20"
            rows={2}
            placeholder="Compartilhe seu conhecimento ou tire uma dúvida sobre esta questão..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || submitting}
              className="bg-legal-500 hover:bg-legal-600 disabled:bg-gray-200 text-white px-6 py-2 rounded-xl font-bold text-xs transition-all"
            >
              {submitting ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">
          <div className="w-6 h-6 border-2 border-legal-200 border-t-legal-500 rounded-full animate-spin mx-auto"></div>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-xs text-gray-400 italic text-center py-4">
          {currentUser ? 'Nenhum comentário ainda. Seja o primeiro a comentar!' : 'Faça login para ver e deixar comentários.'}
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map(comment => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
