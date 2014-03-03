class Admin::CategoriesController < Admin::AdminsController

  before_action :set_category, only: [:update, :destroy, :cannot_destroy_category, :edit, :show]

  rescue_from ActiveRecord::DeleteRestrictionError, with: :cannot_destroy_category
  
  def index
    @categories = Category.page(params[:page]).per(8)
  end

  def new
    @category = Category.new
  end

  def create
    @category = Category.new(category_params)
    if @category.save
      redirect_to admin_category_path(@category), notice: "Category #{ @category.name } was successfully created."
    else
      render action: :new
    end
  end

  def update
    if @category.update(category_params)
      redirect_to admin_category_path(@category), notice: "Category #{ @category.name } was successfully updated."
    else
      render action: :edit
    end
  end

  def destroy
    if(@category.destroy) 
      redirect_to admin_categories_url, notice: "Category #{ @category.name } destroyed successfully."
    else
      redirect_to admin_categories_url, alert: "Category #{ @category.name } was not destroyed successfully."
    end
  end

  private
  def set_category
    @category = Category.find_by(id: params[:id])
    redirect_to root_path, alert: 'Category does not exist' if @category.nil?
  end
  
  def cannot_destroy_category
    redirect_to admin_categories_path, notice: "Category #{ @category.name } has products..It cannot be destroyed"
  end

  def category_params
    params.require(:category).permit(:name)
  end

end
