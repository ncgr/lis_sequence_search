LisSequenceSearch::Application.routes.draw do
  mount Quorum::Engine => "/quorum"
  mount JasmineRails::Engine => "/specs" unless Rails.env.production?
  match "/" => redirect("/quorum")
end
