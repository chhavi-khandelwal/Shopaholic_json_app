module CategoriesHelper
  def extract_filters_from_products(products)
    filters = {}
    filters[:brand] = products.collect { |product| product.brand.name }.flatten.uniq
    filters[:color] = products.collect { |product| product.colors.published.pluck(:name) }.flatten.uniq
    
    filters
  end
end
