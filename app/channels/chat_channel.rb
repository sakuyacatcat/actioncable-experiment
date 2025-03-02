# app/channels/chat_channel.rb
class ChatChannel < ApplicationCable::Channel
  def subscribed
    # 固定のストリーム名 "chat_channel" に購読（実際はルームごとに変えることも可能）
    stream_from "chat_channel"
  end

  def unsubscribed
    # チャンネルからの切断時の処理（必要に応じて実装）
  end

  def speak(data)
    # メッセージを保存
    message = ChatMessage.create!(content: data["message"])
    # 保存したメッセージをブロードキャスト
    ActionCable.server.broadcast("chat_channel", { content: message.content, id: message.id })
  end
end
