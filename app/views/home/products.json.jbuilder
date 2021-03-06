json.(@products) do |json, product|
  json.(product, :id, :title, :description)
  json.brand do |json|
    json.(product.brand, :id, :name)
  end
  json.category do |json|
    json.(product.category, :id, :name)
  end
  json.colors product.colors.published do |json, color|
    json.(color, :id, :name)
    json.sizes color.sizes do |json, size|
      json.(size, :id, :name, :price, :price, :discounted_price)
      json.quantity_available size.available?
    end
    json.images color.images do |json, image|
      json.small image.thumbnail(:small)
      json.medium image.thumbnail(:medium)
      json.large image.thumbnail(:large)
    end
    json.availability color.availability?
  end

end
