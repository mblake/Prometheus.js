class CreateCities < ActiveRecord::Migration
  def change
    create_table :cities do |t|
      t.string :description

      t.timestamps
    end
  end
end
