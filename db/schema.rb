# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140227065105) do

  create_table "brands", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "carts", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "categories", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "colors", force: true do |t|
    t.string   "name"
    t.integer  "product_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "published",  default: false
  end

  add_index "colors", ["product_id"], name: "index_colors_on_product_id", using: :btree

  create_table "images", force: true do |t|
    t.integer  "imageable_id"
    t.string   "imageable_type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "file_file_name"
    t.string   "file_content_type"
    t.integer  "file_file_size"
    t.datetime "file_updated_at"
  end

  add_index "images", ["imageable_id", "imageable_type"], name: "index_images_on_imageable_id_and_imageable_type", using: :btree

  create_table "line_items", force: true do |t|
    t.integer  "cart_id"
    t.integer  "size_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "quantity",   default: 1
  end

  create_table "products", force: true do |t|
    t.string   "title"
    t.text     "description"
    t.integer  "category_id"
    t.integer  "brand_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "published",   default: false
  end

  add_index "products", ["brand_id"], name: "index_products_on_brand_id", using: :btree
  add_index "products", ["category_id"], name: "index_products_on_category_id", using: :btree

  create_table "sizes", force: true do |t|
    t.string   "name"
    t.string   "sku"
    t.decimal  "price",            precision: 10, scale: 2
    t.decimal  "discounted_price", precision: 10, scale: 2
    t.integer  "quantity"
    t.integer  "color_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sizes", ["color_id"], name: "index_sizes_on_color_id", using: :btree

end
