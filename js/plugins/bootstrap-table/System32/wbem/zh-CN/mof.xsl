<?xml version="1.0"?>
<!-- Copyright (c) Microsoft Corporation.  All rights reserved. -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/TR/WD-xsl">


	<!-- Root template selects all children of the CIM/DECLARATIONS tag -->
	
	<xsl:template match="/">
		<xsl:apply-templates select="COMMAND//RESULTS//CIM//CLASS"/>
		<xsl:apply-templates select="COMMAND//RESULTS//CIM//INSTANCE"/>
	</xsl:template>
	
	<!-- CLASS template formats a single CIM non-association class  -->
	
	<xsl:template match="CLASS">
		<DIV CLASS="mofclass">
			<SPAN CLASS="mofqualifierset"><![CDATA[ ]]><xsl:apply-templates select="QUALIFIER"/><br/></SPAN>
			<SPAN CLASS="mofkeyword">class</SPAN>
			<xsl:value-of select="@NAME"/>
			<xsl:apply-templates select="CLASSPATH"/>
			<xsl:if match="*[@SUPERCLASS]">
				<SPAN CLASS="mofsymbol">: </SPAN><xsl:value-of select="@SUPERCLASS"/>
			</xsl:if>
			<BR/>
			<SPAN CLASS="mofsymbol">{</SPAN><BR/>
			<xsl:apply-templates select="PROPERTY"/>
			<xsl:apply-templates select="PROPERTY.ARRAY"/>
			<xsl:apply-templates select="PROPERTY.REFERENCE"/>
			<xsl:apply-templates select="METHOD"/>
			<SPAN CLASS="mofsymbol">};</SPAN>
		</DIV>
	</xsl:template>
	
	<!-- QUALIFIER template formats a list of qualifier name/value pairs -->
	
	<xsl:template match="QUALIFIER">
		<xsl:if match="QUALIFIER[0]"><SPAN CLASS="mofsymbol">[</SPAN></xsl:if>
			<SPAN CLASS="mofqualifier"><xsl:value-of select="@NAME"/></SPAN>
			<SPAN CLASS="mofsymbol">(</SPAN><xsl:apply-templates/><SPAN CLASS="mofsymbol">)</SPAN><xsl:if match="QUALIFIER[$not$ end()]">,
		</xsl:if>
		<xsl:if match="QUALIFIER[end()]"><SPAN CLASS="mofsymbol">]</SPAN>
		</xsl:if>
		
	</xsl:template>
	
	<!-- VALUE template formats a non-array property or qualifier value -->
	
	<xsl:template match="VALUE">
		<xsl:if match="PROPERTY/VALUE"><SPAN CLASS="mofsymbol">=</SPAN></xsl:if>
		<xsl:choose>
			<xsl:when match="*[@TYPE='string']/VALUE"><SPAN CLASS="mofstring">"<xsl:value-of/>"</SPAN></xsl:when>
			<xsl:when match="*[@TYPE='datetime']/VALUE"><SPAN CLASS="mofstring">"<xsl:value-of/>"</SPAN></xsl:when>
			<xsl:when match="*[@TYPE='char16']/VALUE"><SPAN CLASS="mofchar">'<xsl:value-of/>'</SPAN></xsl:when>
			<xsl:otherwise><SPAN CLASS="mofvalue"><xsl:value-of/></SPAN></xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<!-- VALUE.ARRAY/VALUE template formats an array or qualifier property -->
	<!-- value element                                                     -->
	<xsl:template match="VALUE.ARRAY/VALUE">
	 <xsl:choose>
	  <xsl:when match="*[@TYPE='string']/VALUE.ARRAY/VALUE"><SPAN CLASS="mofstring">"<xsl:value-of/>"</SPAN></xsl:when>
	  <xsl:when match="*[@TYPE='datetime']/VALUE.ARRAY/VALUE"><SPAN CLASS="mofstring">"<xsl:value-of/>"</SPAN></xsl:when>
	  <xsl:when match="*[@TYPE='char16']/VALUE.ARRAY/VALUE"><SPAN CLASS="mofchar">'<xsl:value-of/>'</SPAN></xsl:when>
	  <xsl:otherwise><SPAN CLASS="mofvalue"><xsl:value-of/></SPAN></xsl:otherwise>
	 </xsl:choose>
	 <xsl:if match="VALUE[$not$ end()]">,</xsl:if>
	</xsl:template>
	
	<!-- VALUE.ARRAY template formats an array property or qualifier value -->
	<xsl:template match="VALUE.ARRAY">
		<xsl:if match="PROPERTY.ARRAY/VALUE.ARRAY"><SPAN CLASS="mofsymbol">=</SPAN></xsl:if>
		<SPAN CLASS="mofsymbol">{</SPAN><xsl:apply-templates select="VALUE"/><SPAN CLASS="mofsymbol">}</SPAN>
	</xsl:template>
	
	<!-- CLASSPATH template -->
	<xsl:template match="CLASSPATH">
		<xsl:value-of select="@CLASSNAME"/>
	</xsl:template>
	
	<!-- PROPERTY template formats a single CIM non-array property  -->
	
	<xsl:template match="PROPERTY">
	    <DD>
		<DIV CLASS="mofproperty">
		<SPAN CLASS="mofqualifierset"><![CDATA[ ]]><xsl:apply-templates select="QUALIFIER"/></SPAN>
		<SPAN CLASS="mofkeyword"><xsl:value-of select="@TYPE"/></SPAN>
		<SPAN CLASS="mofproperty"><xsl:value-of select="@NAME"/></SPAN>
		<xsl:apply-templates select="VALUE"/>
		<SPAN CLASS="mofsymbol">;</SPAN><BR/>
		</DIV>
		</DD>
	</xsl:template>
	
	<!-- PROPERTY.ARRAY template formats a single CIM array property  -->
	
	<xsl:template match="PROPERTY.ARRAY">
	    <DD>
		<DIV CLASS="mofproperty">
		<SPAN CLASS="mofqualifierset"><![CDATA[ ]]><xsl:apply-templates select="QUALIFIER"/></SPAN>
		<SPAN CLASS="mofkeyword"><xsl:value-of select="@TYPE"/></SPAN>
		<SPAN CLASS="mofproperty"><xsl:value-of select="@NAME"/></SPAN>
		<SPAN CLASS="mofsymbol">[</SPAN><xsl:value-of select="@ARRAYSIZE"/><SPAN CLASS="mofsymbol">]</SPAN>
		<xsl:apply-templates select="VALUE.ARRAY"/><SPAN CLASS="mofsymbol">;</SPAN><BR/>
		</DIV>
		</DD>
	</xsl:template>
	
	<!-- METHOD template formats a single CIM method  -->
	
	<xsl:template match="METHOD">
		<DIV CLASS="mofmethod">
		<SPAN CLASS="mofqualifierset"><![CDATA[ ]]><xsl:apply-templates select="QUALIFIER"/></SPAN>
		<SPAN CLASS="mofkeyword"><xsl:value-of select="@TYPE"/></SPAN>
		<SPAN CLASS="mofmethod"><xsl:value-of select="@NAME"/></SPAN>
		<SPAN CLASS="mofsymbol">(</SPAN>
		<xsl:apply-templates select="METHODPARAMETER"/>
		<SPAN CLASS="mofsymbol">);</SPAN>
		</DIV>
	</xsl:template>
	
	<!-- METHODPARAMETER template formats a single CIM method parameter  -->
	
	<xsl:template match="METHODPARAMETER">
		<DIV CLASS="mofmethodparameter">
		<SPAN CLASS="mofqualifierset"><![CDATA[ ]]><xsl:apply-templates select="QUALIFIER"/></SPAN>
		<xsl:choose>
			<xsl:when match="METHODPARAMETER/PARAMETER">
				<SPAN CLASS="mofkeyword"><xsl:value-of select="METHODPARAMETER/PARAMETER[@TYPE]"/></SPAN>
			</xsl:when>
			<xsl:when match="METHODPARAMETER/PARAMETER.REFERENCE">
				<SPAN CLASS="mofkeyword">object ref</SPAN>
			</xsl:when>
			<xsl:when match="METHODPARAMETER/PARAMETER.REFERENCE[@REFERENCECLASS]">
				<SPAN CLASS="mofkeyword"><xsl:value-of select="METHODPARAMETER/PARAMETER.REFERENCE[@REFERENCECLASS]"/> ref</SPAN>
			</xsl:when>
		</xsl:choose>
		<xsl:value-of select="@NAME"/><xsl:if match="METHODPARAMETER[$not$ end()]"><SPAN CLASS="mofsymbol">,</SPAN>
		</xsl:if>
		</DIV>
	</xsl:template>
	
	<!-- INSTANCE template formats a single CIM non-association instance  -->
	
	<xsl:template match="INSTANCE">
		<DIV CLASS="mofinstance">
			<SPAN CLASS="mofqualifierset"><![CDATA[ ]]><xsl:apply-templates select="QUALIFIER"/><br/></SPAN>
			<SPAN CLASS="mofkeyword">instance of</SPAN>
			<xsl:value-of select="@CLASSNAME"/>
			<SPAN CLASS="mofsymbol">{</SPAN><BR/>
			<DL>
			<xsl:apply-templates select="PROPERTY"/>
			<xsl:apply-templates select="PROPERTY.ARRAY"/>
			<xsl:apply-templates select="PROPERTY.REFERENCE"/>
			</DL>
			<SPAN CLASS="mofsymbol">};</SPAN>
		</DIV>
	</xsl:template>
	
	<!-- VALUE.REFERENCE template formats a reference property value -->
	<xsl:template match="VALUE.REFERENCE">
		<SPAN CLASS="mofsymbol">=</SPAN>
		<SPAN CLASS="mofstring">"<xsl:apply-templates/>"</SPAN>
	</xsl:template>

	<xsl:template match="KEYBINDING/VALUE.REFERENCE">
			<SPAN CLASS="mofstring">"<xsl:apply-templates/>"</SPAN>
	</xsl:template>
	
	<xsl:template match="VALUE.REFERENCE/CLASSPATH">
		<xsl:apply-templates select="NAMESPACEPATH"/>:<xsl:value-of select="@CLASSNAME"/>
	</xsl:template>
	
	<xsl:template match="INSTANCEPATH">
		<xsl:apply-templates select="NAMESPACEPATH"/>:<xsl:apply-templates select="INSTANCENAME"/>
	</xsl:template>

	<xsl:template match="INSTANCENAME">
		<xsl:value-of select="@CLASSNAME"/>.<xsl:for-each select="KEYBINDING"><xsl:apply-templates select="."/></xsl:for-each>
	</xsl:template>
	
	<!-- NAMESPACEPATH template formats a reference property value -->
	<xsl:template match="NAMESPACEPATH">
		<xsl:apply-templates/>
	</xsl:template>

	<xsl:template match="HOST">\\<xsl:value-of select="."/></xsl:template>

	<xsl:template match="LOCALNAMESPACEPATH"><xsl:apply-templates select="NAMESPACE"/></xsl:template>

	<xsl:template match="NAMESPACE">\<xsl:value-of select="@NAME"/></xsl:template>
	
	<!-- KEYBINDING template formats a reference property value -->
	<xsl:template match="KEYBINDING">
		<xsl:value-of select="@NAME"/>=<xsl:apply-templates select="KEYVALUE"/><xsl:if match="KEYBINDING[$not$ end()]">,</xsl:if>
	</xsl:template>
	
	<xsl:template match="KEYVALUE">
		<xsl:choose>
			<xsl:when match="*[@TYPE='numeric']/VALUE"><SPAN CLASS="mofvalue"><xsl:value-of/></SPAN></xsl:when>
			<xsl:when match="*[@TYPE='boolean']/VALUE"><SPAN CLASS="mofvalue"><xsl:value-of/></SPAN></xsl:when>
			<xsl:otherwise><SPAN CLASS="mofstring">"<xsl:value-of/>"</SPAN></xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<!-- PROPERTY.REFERENCE template formats a single CIM reference property  -->
	
	<xsl:template match="PROPERTY.REFERENCE">
		<DIV CLASS="mofproperty">
		<SPAN CLASS="mofqualifierset"><![CDATA[ ]]><xsl:apply-templates select="QUALIFIER"/></SPAN>
		<SPAN CLASS="mofkeyword">
		<xsl:choose>
			<xsl:when match="*[@REFERENCECLASS]"><xsl:value-of select="@REFERENCECLASS"/> ref</xsl:when>
			<xsl:otherwise>object ref</xsl:otherwise>
		</xsl:choose>
		</SPAN>
		<SPAN CLASS="mofproperty"><xsl:value-of select="@NAME"/></SPAN>
		<xsl:apply-templates select="VALUE.REFERENCE"/>
		<SPAN CLASS="mofsymbol">;</SPAN><BR/>
		</DIV>
	</xsl:template>
	
</xsl:stylesheet>
