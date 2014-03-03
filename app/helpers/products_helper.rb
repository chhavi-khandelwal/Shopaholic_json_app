module ProductsHelper
  def get_product_images(color)
    data_images, data_image_angles = [], []
    color.images.each do |image|
      data_images.push(image.thumbnail(:small))
      data_image_angles.push(image.thumbnail(:medium))
    end
    [ data_images, data_image_angles ]
  end
end
