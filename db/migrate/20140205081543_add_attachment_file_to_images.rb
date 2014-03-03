class AddAttachmentFileToImages < ActiveRecord::Migration
  def self.up
    add_attachment :images, :file
  end

  def self.down
    remove_attachment :images, :avatar
  end
end
