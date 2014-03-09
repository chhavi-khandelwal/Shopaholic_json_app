class Admin::SizesController < Admin::AdminsController
  before_action :set_product, only: [:new, :create]
  before_action :set_size, only: [:update, :destroy, :edit]


  def new
    @size = Size.new 
    render partial: 'form'
  end

  def create
    #FIXME_AB: What if color not found with the id
    color = Color.find_by(id: size_params[:color_id])
    @size = color.sizes.build(size_params)
    if @size.save
      render json: { size: @size, color: @size.color.name }
      flash[:notice] = "Successfully created size"
    else
      render json: { error: @size.errors.full_messages.first }
    end

  end

  def update
    if @size.update(size_params)
      flash[:notice] = "Successfully updated size"
    else
      render action: :edit
    end
  end

  def destroy
    @size.destroy
  end

  private
  def set_size
    @size = Size.find_by(id: params[:id])
    redirect_to admin_products_path, alert: 'Size Not found' if(@size.nil?)
  end

  def set_product
    @product = Product.find_by(id: params[:product_id])
    redirect_to admin_products_path, alert: 'Product Not found' if(@product.nil?)
  end

  def size_params
    params.require(:size).permit(:name, :sku, :price, :discounted_price, :quantity, :color_id)
  end

end
