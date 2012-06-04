LisSequenceSearch::Application.routes.draw do
  mount Resque::Server.new, :at => "/quorum/resque"
  mount Quorum::Engine => "/quorum"
  match "/" => redirect("/quorum")
end
