class AddPublishedToColors < ActiveRecord::Migration
  def change
    add_column :colors, :published, :boolean, default: false
  end
end
