class CartsController < ApplicationController
  before_action :set_cart, only: [:show]
  before_action :set_size, only: [:create]
  before_action :set_cart_by_session, only: [:create]

  def payment
    #FIXME_AB: You should not modify original qty of the size. Instead whenever you should calculate the remaining qty by original qty - ordered qty.
    #Fixed
    quantity = params[:quantities]
    Size.where(id: params[:ids]).each_with_index do |size,index|
      original_quantity = size.quantity
      ordered_quantity = quantity[index].to_i
      if(original_quantity - ordered_quantity > 0) 
        size.quantity -= ordered_quantity
        size.save
      end
    end
  end

  def create
    line_item = @cart.line_items.find_by(size_id: @size.id)
    #FIXME_AB: Instead up update_cart should be named as add_item
    #Fixed
    @cart.add_item(line_item, @size)

    #FIXME_AB: json part should be in view
    render json: { cart_id: @cart.id, cart_size: @cart.line_items.count }
  end

  private
  def set_cart
    #FIXME_AB: What if cart is not found with the id
    #Fixed
    @cart = Cart.find_by(id: params[:id])
    redirect_to root_path, alert: 'Cart not found' if (@cart.nil?)
  end

  def set_size
    #FIXME_AB: What if size is not found with the id
    #Fixed
    @size = Size.find_by(id: params[:size_id])
    redirect_to root_path, alert: 'Size not found' if (@size.nil?)
  end

  def set_cart_by_session
    # session[:cart_id] = nil
    if(session[:cart_id])
      #FIXME_AB: What if cart is not found with the id saved in session?
      #Fixed
      @cart = Cart.find_by(id: session[:cart_id])
      redirect_to root_path, alert: 'Cart not found' if (@cart.nil?)
    else
      @cart = Cart.create
      session[:cart_id] = @cart.id
    end
  end
end
