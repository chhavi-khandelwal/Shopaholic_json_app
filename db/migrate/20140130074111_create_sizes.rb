class CreateSizes < ActiveRecord::Migration
  def change
    create_table :sizes do |t|
      t.string :name
      t.string :sku
      t.decimal :price, precision:10, scale: 2
      t.decimal :discounted_price, precision:10, scale:2
      t.integer :quantity
      t.references :color, index: true
      t.timestamps
    end
  end
end
