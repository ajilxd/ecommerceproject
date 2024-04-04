 <h2 class="h5 ms-3">Your Orders</h2>
    <%orderData.forEach(i=>{%>
    <div class="card">
        <div class="card-body">
          <div class="is-flex justify-content-evenly ">
            <p class="text-muted">Order placed -<%=i.createdAt.toISOString().split('T')[0]%></p>
            <p class="text-muted">Totals -<%=i.orderAmount%>/-</p>
            <p class="text-muted">Pincode - 673591 </p>
            <p class="text-muted">#<%= i.orderId %></p>
          </div>
          <div class="is-flex justify-content-evenly mt-3">
            <%i.orderedItems.forEach(i=>{%>
              <table>
                <tr>
                  <td> <img src="/multer/products/<%= i.image %>" alt="" class="img-fluid" style="max-height:100px;"></td>
                  <td> <%= i.productname %></p></td>
                  <td><%= i.quantity %></td>
                </tr>
              
            <%})%>
        </div>
      </div>
            <div class="col-2">
              <p class="text-success h4"><%= i.status %></p>
              <%if(i.status=='pending'){%>
              <button class="btn btn-primary btn-lg my-3 paybtns" data-id="<%=i.orderId%>" data-amount="<%=i.orderAmount%>">Pay</button>
              <%}%>
              <!-- check whether status is delivered or not -->
              <%notDelivered = i.status!=='Delivered'%>
              <%notCancelled = i.status!=='Cancelled'%>
              <%notReturned = i.status !=='Returned'%>
              <!-- Calculate 10 days + createdAt date of order -->
              <% var datePlus10Days = new Date(i.createdAt); %>
              <% datePlus10Days.setDate(datePlus10Days.getDate() + 10); %>
              <% var validReturnPeriod = datePlus10Days.toISOString().split('T')[0]; %>
              <!-- Get current date -->
              <% var currentDate = new Date().toISOString().split('T')[0]; %>
              <!-- Check if current date is less than or equal to valid return period, allow return -->
              <% if (currentDate >= validReturnPeriod || !notDelivered) { %>
                  <button class="btn btn-warning returnmodalbtns" data-id="<%=i.orderId%>" >Return</button>
              <% } %>
              <% if (notDelivered&&notCancelled&&notReturned){%>
                <button class="btn btn-danger cancelmodalbtns"  data-id="<%=i.orderId%>">Cancel</button>
              <%}%>
          </div>
          
        </div>
        
       
      
      <%})%>