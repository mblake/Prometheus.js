class CreateSubscriptionsUsers < ActiveRecord::Migration
  def up
    create_table :subscriptions_users, :id=>false do |t|
      t.integer :subscription_id
      t.integer :product_id
    end
  end

  def down
  end
end
