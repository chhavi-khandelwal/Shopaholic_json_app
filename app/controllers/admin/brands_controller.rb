class Admin::BrandsController < Admin::AdminsController
  before_action :set_brand, only: [:update, :destroy, :cannot_destroy_brand, :edit, :show]
  
  rescue_from ActiveRecord::DeleteRestrictionError, with: :cannot_destroy_brand

  def index
    @brands = Brand.page(params[:page]).per(8)
  end

  def new
    @brand = Brand.new
  end

  def create
    @brand = Brand.new(brand_params)

    if @brand.save
      redirect_to admin_brands_path, notice: 'Brand was successfully created.'
    else
      render action: :new
    end
  end

  def update
    if @brand.update(brand_params)
      redirect_to admin_brands_path, notice: "Brand #{ @brand.name } was successfully updated."
    else
      render action: :edit
    end
  end

  def destroy
    if @brand.destroy
      redirect_to admin_brands_url, notice: "Brand #{ @brand.name } was successfully destroyed."
    else
      redirect_to admin_brands_url, alert: "Brand #{ @brand.name } was not successfully destroyed."
    end
  end

  private
  def set_brand
    @brand = Brand.find_by(id: params[:id])
    redirect_to root_url, alert: "Brand not found" if(@brand.nil?)
  end

  def brand_params
    params.require(:brand).permit(:name, :logo)
  end

  def cannot_destroy_brand
    redirect_to admin_brands_path, notice: "Brand #{ @brand.name } has products..It cannot be destroyed"
  end

end
