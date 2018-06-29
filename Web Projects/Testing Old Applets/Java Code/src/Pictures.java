/**
 * @(#)Pictures.java
 *
 * Pictures Applet application
 *
 * @author 
 * @version 1.00 2013/12/31
 */
 
import java.awt.*;
import java.applet.*;

public class Pictures extends Applet {
	
	public void init() {
	}

	public void paint(Graphics g) {
		
	int x = 1;
	while(x>0)
	{
	
		Image monkey1 = getImage(getDocumentBase(),"Monkeyidle.JPG");
		g.drawImage(monkey1,500,100,this);
		for(int i = 0 ; i< 90000000;i++);
		Image monkey2 = getImage(getDocumentBase(),"Monkeyup.JPG");
		g.drawImage(monkey2,500,100,this);
		for(int i = 0 ; i< 90000000;i++);
		Image monkey3 = getImage(getDocumentBase(),"Monkeyright.JPG");
		g.drawImage(monkey3,500,100,this);
		for(int i = 0 ; i< 90000000;i++);
		Image monkey4 = getImage(getDocumentBase(),"Monkeyleft.JPG");
		g.drawImage(monkey4,500,100,this);
		for(int i = 0 ; i< 90000000;i++);
		Image monkey5 = getImage(getDocumentBase(),"Monkeydown.JPG");
		g.drawImage(monkey5,500,100,this);
		for(int i = 0 ; i< 90000000;i++);
		
	
		}
			
		//for(int i = 0 ; i< 900000000;i++);

	}	
		
	}
