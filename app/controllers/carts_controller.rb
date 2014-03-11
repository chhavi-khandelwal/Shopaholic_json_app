class CartsController < ApplicationController
  before_action :set_cart, only: [:show]
  before_action :set_size, only: [:create]
  before_action :set_cart_by_session, only: [:create]

  def payment
    #FIXME_AB: You should not modify original qty of the size. Instead whenever you should calculate the remaining qty by original qty - ordered qty.
    quantity = params[:quantities]
    Size.where(id: params[:ids]).each_with_index do |size,index|
      size.quantity -= quantity[index].to_i
      size.save
    end
  end

  def create
    #FIXME_AB: Looks like it is n
    line_item = @cart.line_items.find_by(size_id: @size.id)
    #FIXME_AB: Instead up update_cart should be named as add_item
    @cart.update_cart(line_item, @size)

    #FIXME_AB: json part should be in view
    render json: { cart_id: @cart.id, cart_size: @cart.line_items.count }
  end

  private
  def set_cart
    #FIXME_AB: What if cart is not found with the id
    @cart = Cart.find_by(id: params[:id])
  end

  def set_size
    #FIXME_AB: What if size is not found with the id
    @size = Size.find_by(id: params[:size_id])
  end

  def set_cart_by_session
    # session[:cart_id] = nil
    if(session[:cart_id])
      #FIXME_AB: What if cart is not found with the id saved in session?
      @cart = Cart.find_by(id: session[:cart_id])
    else
      @cart = Cart.create
      session[:cart_id] = @cart.id
    end
  end
end
