class SamplesController < ApplicationController
  def index
    @users = User.all.to_json
    @product = Product.all.to_json
    @subscription = Subscription.all.to_json
    @data = @subscription + @users + @product
    @data = @data.to_json
  end
end