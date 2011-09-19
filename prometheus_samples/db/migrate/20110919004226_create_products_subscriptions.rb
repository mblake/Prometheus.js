class CreateProductsSubscriptions < ActiveRecord::Migration
  def up
    create_table :products_subscriptions, :id=>false do |t|
      t.integer :product_id
      t.integer :subscription_id 
    end
  end

  def down
  end
end
