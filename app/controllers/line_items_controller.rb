class LineItemsController < ApplicationController
  
  before_action :set_line_item
  
  def destroy
    if(@line_item.destroy)
      redirect_to :back, notice: 'Item removed'
    else
      redirect_to :back, alert: "Unable to remove item"
    end
  end

  private

  def set_line_item
    @line_item = LineItem.find_by(id: params[:id])
    redirect_to root_path, alert: 'Line item not found' if @line_item.nil?
  end
end
