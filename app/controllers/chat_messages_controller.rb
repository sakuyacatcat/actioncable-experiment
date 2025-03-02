class ChatMessagesController < ApplicationController
  def index
    # last_idパラメータがあれば、それ以降のメッセージを取得
    @messages = if params[:last_id].present?
                 ChatMessage.where('id > ?', params[:last_id])
               else
                 ChatMessage.all
               end

    render json: @messages
  end
end
