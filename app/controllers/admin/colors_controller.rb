class Admin::ColorsController < Admin::AdminsController
  before_action :set_color, only: [:update, :destroy, :edit, :cannot_destroy_color]
  before_action :set_product, only: [:new, :create]

  rescue_from ActiveRecord::DeleteRestrictionError, with: :cannot_destroy_color

  def new
    @color = Color.new
    render partial: 'form'
  end


  def create
    @color = @product.colors.build(color_params)
    if @color.save
      redirect_to admin_product_path(@product), notice: 'Color was successfully created.'
    else
      redirect_to admin_product_path(@product), alert: 'Image format not supported'
    end
  end

  def edit
    render partial: 'shallow_form'
  end

  def update
    if @color.update(color_params)
      redirect_to admin_product_path(@color.product), notice: "#{ @color.name } was successfully updated."
    else
      redirect_to :back, alert: "#{ @color.name } wasn't successfully updated."
    end
  end

  def destroy
    @color.destroy
    render json: @color
  end

  private
  def set_color
    @color = Color.find_by(id: params[:id])
    redirect_to admin_products_path, alert: 'Color not found'  if @color.nil?
  end

  def set_product
    @product = Product.find_by(id: params.require(:product_id))
    redirect_to admin_products_path, alert: 'Product not found' if @product.nil?    
  end

  def color_params
    params.require(:color).permit(:name, images_attributes: [:id, :file])
  end

  def cannot_destroy_color
    flash.now[:notice] = "#{ @color.name } has sizes..It cannot be destroyed."
    render partial: 'notice'
  end

end
