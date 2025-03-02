Rails.application.routes.draw do
  root "chats#index"
  resources :chat_messages, only: [:index]
end
